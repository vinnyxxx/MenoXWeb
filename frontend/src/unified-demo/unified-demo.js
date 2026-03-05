/**
 * Unified Hero Demo Animation
 * Flow: Article → select → ⌘+` → AI chat (with typing in real input) → close AI
 *       → Ctrl+` → Scratchpad → Summary → Learn → Maps (with node click) → loop
 */
(function() {
    'use strict';

    let timers = [];
    let root = null;

    function schedule(fn, ms) {
        const id = setTimeout(fn, ms);
        timers.push(id);
    }

    function clearAll() {
        timers.forEach(clearTimeout);
        timers = [];
    }

    function q(s) { return root.querySelector(s); }
    function qAll(s) { return root.querySelectorAll(s); }

    function reset() {
        // Phase 1
        q('.ud-editor').classList.remove('ud-hide');
        q('.ud-select').classList.remove('ud-selecting', 'ud-selected');
        q('#kb-cmd').classList.remove('demo-keyboard-visible', 'demo-keyboard-pressed');
        q('#kb-ctrl').classList.remove('demo-keyboard-visible', 'demo-keyboard-pressed');
        q('.ud-ai').classList.remove('ud-show');
        qAll('.ud-msg').forEach(m => m.classList.remove('ud-show'));

        // Real input
        const realInput = q('.ud-real-input');
        if (realInput) realInput.value = '';
        const sendBtn = q('.ud-send');
        if (sendBtn) sendBtn.classList.remove('ud-send-glow', 'ud-send-press');

        // Phase 2
        q('.ud-pad').classList.remove('ud-show');
        q('.ud-doc-text').classList.remove('ud-show');
        qAll('.ud-tab').forEach(t => t.classList.remove('ud-active'));
        q('.ud-summary').classList.remove('ud-show');
        q('.ud-learn').classList.remove('ud-show');
        q('.ud-maps').classList.remove('ud-show');
        qAll('.ud-node').forEach(n => n.classList.remove('ud-show', 'ud-node-hover', 'ud-node-clicked'));
        qAll('.ud-mlabel').forEach(l => l.classList.remove('ud-show'));
        q('.ud-card').classList.remove('ud-show');

        // Clear SVG lines
        var svg = document.getElementById('ud-map-svg');
        if (svg) svg.innerHTML = '';

        // Reset progress
        setProgress('chat');
    }

    function setProgress(stepName) {
        qAll('.ud-progress-step').forEach(function(el) {
            el.classList.remove('ud-step-active');
            if (el.getAttribute('data-step') === stepName) {
                el.classList.add('ud-step-active');
            }
        });
    }

    function jumpToStage(stepName) {
        // Stop auto animation
        clearAll();

        // Show scratchpad for all non-chat stages
        if (stepName === 'chat') {
            reset();
            q('.ud-editor').classList.remove('ud-hide');
            q('.ud-select').classList.add('ud-selected');
            q('.ud-ai').classList.add('ud-show');
            q('.ud-msg-1').classList.add('ud-show');
            q('.ud-msg-2').classList.add('ud-show');
            q('.ud-msg-3').classList.add('ud-show');
            setProgress('chat');
            // After 0.5s, resume from AI close onward
            schedule(function() { run(); }, 500);
            return;
        }

        // Hide editor, show pad
        q('.ud-editor').classList.add('ud-hide');
        q('.ud-pad').classList.add('ud-show');
        q('.ud-doc-text').classList.add('ud-show');
        hideAllPanels();
        qAll('.ud-node').forEach(function(n) { n.classList.remove('ud-show', 'ud-node-hover', 'ud-node-clicked'); });
        qAll('.ud-mlabel').forEach(function(l) { l.classList.remove('ud-show'); });
        q('.ud-card').classList.remove('ud-show');
        var svg = document.getElementById('ud-map-svg');
        if (svg) svg.innerHTML = '';

        if (stepName === 'scratchpad') {
            qAll('.ud-tab').forEach(function(t) { t.classList.remove('ud-active'); });
            setProgress('scratchpad');
            // Continue: summary after 0.5s, then learn, maps, loop
            schedule(function() { continueFromSummary(); }, 500);
        } else if (stepName === 'summary') {
            activateTab('summary');
            q('.ud-summary').classList.add('ud-show');
            setProgress('summary');
            schedule(function() { continueFromLearn(); }, 500);
        } else if (stepName === 'learn') {
            activateTab('learn');
            q('.ud-learn').classList.add('ud-show');
            setProgress('learn');
            schedule(function() { continueFromMaps(); }, 500);
        } else if (stepName === 'map') {
            activateTab('map');
            q('.ud-maps').classList.add('ud-show');
            qAll('.ud-node').forEach(function(n) { n.classList.add('ud-show'); });
            qAll('.ud-mlabel').forEach(function(l) { l.classList.add('ud-show'); });
            setProgress('map');
            drawMapLines();
            // Show node click + card, then loop
            var clickNode = q('.ud-node-click');
            schedule(function() { if (clickNode) clickNode.classList.add('ud-node-hover'); }, 1000);
            schedule(function() { if (clickNode) { clickNode.classList.remove('ud-node-hover'); clickNode.classList.add('ud-node-clicked'); } }, 1400);
            schedule(function() { q('.ud-card').classList.add('ud-show'); }, 1600);
            schedule(function() { reset(); schedule(run, 500); }, 6000);
        }
    }

    function continueFromSummary() {
        activateTab('summary'); setProgress('summary');
        hideAllPanels(); q('.ud-summary').classList.add('ud-show');
        schedule(function() { continueFromLearn(); }, 4500);
    }

    function continueFromLearn() {
        activateTab('learn'); setProgress('learn');
        hideAllPanels(); q('.ud-learn').classList.add('ud-show');
        schedule(function() { continueFromMaps(); }, 4500);
    }

    function continueFromMaps() {
        activateTab('map'); setProgress('map');
        hideAllPanels(); q('.ud-maps').classList.add('ud-show');
        var nodes = qAll('.ud-node');
        var labels = qAll('.ud-mlabel');
        nodes.forEach(function(n, i) { schedule(function() { n.classList.add('ud-show'); }, i * 200); });
        labels.forEach(function(l, i) { schedule(function() { l.classList.add('ud-show'); }, 400 + i * 150); });
        schedule(function() { drawMapLines(); }, 1500);
        var clickNode = q('.ud-node-click');
        schedule(function() { if (clickNode) clickNode.classList.add('ud-node-hover'); }, 2000);
        schedule(function() { if (clickNode) { clickNode.classList.remove('ud-node-hover'); clickNode.classList.add('ud-node-clicked'); } }, 2400);
        schedule(function() { q('.ud-card').classList.add('ud-show'); }, 2600);
        schedule(function() { reset(); schedule(run, 500); }, 7000);
    }

    function drawMapLines() {
        var svg = document.getElementById('ud-map-svg');
        var mapsEl = q('.ud-maps');
        if (!svg || !mapsEl) return;
        svg.innerHTML = '';
        var mapsRect = mapsEl.getBoundingClientRect();
        function nodeCenter(id) {
            var el = document.getElementById(id);
            if (!el) return { x: 0, y: 0 };
            var r = el.getBoundingClientRect();
            return { x: r.left + r.width / 2 - mapsRect.left, y: r.top + r.height / 2 - mapsRect.top };
        }
        var connections = [
            ['node-transformer', 'node-self-attention'],
            ['node-transformer', 'node-parallelism'],
            ['node-transformer', 'node-rnn'],
            ['node-transformer', 'node-tokens'],
            ['node-self-attention', 'node-parallelism']
        ];
        connections.forEach(function(pair) {
            var a = nodeCenter(pair[0]);
            var b = nodeCenter(pair[1]);
            var line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', a.x); line.setAttribute('y1', a.y);
            line.setAttribute('x2', b.x); line.setAttribute('y2', b.y);
            line.classList.add('ud-line-show');
            svg.appendChild(line);
        });
    }

    function hideAllPanels() {
        q('.ud-summary').classList.remove('ud-show');
        q('.ud-learn').classList.remove('ud-show');
        q('.ud-maps').classList.remove('ud-show');
    }

    var tabTimer1 = null;
    var tabTimer2 = null;

    function activateTab(name) {
        // Clear any pending tab animations
        if (tabTimer1) clearTimeout(tabTimer1);
        if (tabTimer2) clearTimeout(tabTimer2);

        qAll('.ud-tab').forEach(t => t.classList.remove('ud-active', 'ud-tab-glow', 'ud-tab-press'));
        const tab = q('.ud-tab[data-tab="' + name + '"]');
        if (tab) {
            tab.classList.add('ud-tab-glow');
            tabTimer1 = setTimeout(function() {
                tab.classList.remove('ud-tab-glow');
                tab.classList.add('ud-tab-press');
                tabTimer2 = setTimeout(function() {
                    tab.classList.remove('ud-tab-press');
                    tab.classList.add('ud-active');
                }, 200);
            }, 400);
        }
    }

    function run() {
        clearAll();
        reset();

        // -- Phase 1: Article + AI --

        // 1s: select text
        schedule(function() { q('.ud-select').classList.add('ud-selecting'); }, 1000);
        schedule(function() {
            q('.ud-select').classList.remove('ud-selecting');
            q('.ud-select').classList.add('ud-selected');
        }, 1800);

        // 2.5s: ⌘+` keyboard
        schedule(function() { q('#kb-cmd').classList.add('demo-keyboard-visible'); }, 2500);
        schedule(function() { q('#kb-cmd').classList.add('demo-keyboard-pressed'); }, 3000);
        schedule(function() { q('#kb-cmd').classList.remove('demo-keyboard-visible', 'demo-keyboard-pressed'); }, 3500);

        // 3.8s: AI window
        schedule(function() { q('.ud-ai').classList.add('ud-show'); }, 3800);
        schedule(function() { q('.ud-msg-1').classList.add('ud-show'); }, 4300);

        // 5s: type in real input
        var typingText = "What's the difference between self-attention and cross-attention?";
        var realInput = q('.ud-real-input');
        var charIdx = 0;
        var typeSpeed = 30;

        function typeNext() {
            if (charIdx < typingText.length) {
                charIdx++;
                realInput.value = typingText.substring(0, charIdx);
                schedule(typeNext, typeSpeed);
            }
        }
        schedule(typeNext, 5200);

        var typingDone = 5200 + typingText.length * typeSpeed;

        // Send button glows when typing done
        var sendBtn = q('.ud-send');
        schedule(function() {
            if (sendBtn) sendBtn.classList.add('ud-send-glow');
        }, typingDone);

        // "Send" — press effect, clear input, show user message
        schedule(function() {
            if (sendBtn) {
                sendBtn.classList.remove('ud-send-glow');
                sendBtn.classList.add('ud-send-press');
            }
        }, typingDone + 400);
        schedule(function() {
            if (sendBtn) sendBtn.classList.remove('ud-send-press');
            realInput.value = '';
            q('.ud-msg-2').classList.add('ud-show');
        }, typingDone + 600);

        // AI response
        schedule(function() {
            q('.ud-msg-3').classList.add('ud-show');
        }, typingDone + 1500);

        // Close AI
        var aiDone = typingDone + 4000;
        schedule(function() { q('.ud-ai').classList.remove('ud-show'); }, aiDone);

        // Ctrl+` keyboard for Scratchpad
        var kb2Start = aiDone + 300;
        schedule(function() { q('#kb-ctrl').classList.add('demo-keyboard-visible'); }, kb2Start);
        schedule(function() { q('#kb-ctrl').classList.add('demo-keyboard-pressed'); }, kb2Start + 500);
        schedule(function() { q('#kb-ctrl').classList.remove('demo-keyboard-visible', 'demo-keyboard-pressed'); }, kb2Start + 1000);

        // Hide editor, show scratchpad
        var padStart = kb2Start + 1200;
        schedule(function() { q('.ud-editor').classList.add('ud-hide'); setProgress('scratchpad'); }, padStart);
        schedule(function() { q('.ud-pad').classList.add('ud-show'); }, padStart + 500);
        schedule(function() { q('.ud-doc-text').classList.add('ud-show'); }, padStart + 1200);

        // -- Phase 2: Scratchpad tabs --

        // Summary
        schedule(function() { activateTab('summary'); setProgress('summary'); }, padStart + 2500);
        schedule(function() { hideAllPanels(); q('.ud-summary').classList.add('ud-show'); }, padStart + 3000);

        // Learn
        schedule(function() { activateTab('learn'); setProgress('learn'); }, padStart + 7000);
        schedule(function() { hideAllPanels(); q('.ud-learn').classList.add('ud-show'); }, padStart + 7500);

        // Maps
        schedule(function() { activateTab('map'); setProgress('map'); }, padStart + 12000);
        schedule(function() { hideAllPanels(); q('.ud-maps').classList.add('ud-show'); }, padStart + 12500);

        // Map nodes staggered
        var nodes = qAll('.ud-node');
        var labels = qAll('.ud-mlabel');
        nodes.forEach(function(n, i) { schedule(function() { n.classList.add('ud-show'); }, padStart + 13000 + i * 200); });
        labels.forEach(function(l, i) { schedule(function() { l.classList.add('ud-show'); }, padStart + 13400 + i * 150); });

        // Draw SVG lines between nodes using getBoundingClientRect
        schedule(function() {
            drawMapLines();
        }, padStart + 14000);

        // Click Self-Attention node → hover 400ms → click 200ms → card
        var clickNode = q('.ud-node-click');
        schedule(function() {
            if (clickNode) clickNode.classList.add('ud-node-hover');
        }, padStart + 14500);
        schedule(function() {
            if (clickNode) {
                clickNode.classList.remove('ud-node-hover');
                clickNode.classList.add('ud-node-clicked');
            }
        }, padStart + 14900);
        schedule(function() {
            q('.ud-card').classList.add('ud-show');
        }, padStart + 15100);

        // Loop
        schedule(function() {
            reset();
            schedule(run, 500);
        }, padStart + 20000);
    }

    function init() {
        root = document.querySelector('.ud-demo');
        if (!root) return;

        // Bind progress bar clicks
        qAll('.ud-progress-step').forEach(function(el) {
            el.addEventListener('click', function() {
                var step = el.getAttribute('data-step');
                if (step) jumpToStage(step);
            });
        });

        var observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    run();
                } else {
                    clearAll();
                    reset();
                }
            });
        }, { threshold: 0.15 });

        observer.observe(root);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
