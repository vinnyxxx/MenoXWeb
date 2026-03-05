/**
 * Scratchpad Demo Animation
 * Phases: Text select → AI chat → Close AI → Scratchpad opens → Summary → Learn → Maps → Loop
 */
(function() {
    'use strict';

    const TIMINGS = {
        SELECT_START: 1000,
        SELECT_DONE: 1800,
        KEYBOARD_SHOW: 2500,
        KEYBOARD_PRESS: 3000,
        KEYBOARD_HIDE: 3500,
        AI_SHOW: 3800,
        AI_MSG1: 4300,
        AI_MSG2: 5300,
        AI_MSG3: 6300,
        AI_CLOSE: 8500,
        EDITOR_HIDE: 9000,
        PAD_SHOW: 9500,
        DOC_TEXT: 10200,
        SUMMARY_ACTIVE: 11500,
        SUMMARY_SHOW: 12000,
        LEARN_ACTIVE: 16000,
        LEARN_SHOW: 16500,
        MAPS_ACTIVE: 21000,
        MAPS_SHOW: 21500,
        MAPS_NODES: 22000,
        MAPS_CARD: 23500,
        LOOP_RESET: 28000
    };

    let timers = [];
    let container = null;

    function schedule(fn, delay) {
        const id = setTimeout(fn, delay);
        timers.push(id);
        return id;
    }

    function clearAllTimers() {
        timers.forEach(clearTimeout);
        timers = [];
    }

    function q(sel) { return container.querySelector(sel); }
    function qAll(sel) { return container.querySelectorAll(sel); }

    function resetAll() {
        // Phase 1 elements
        const editor = q('.sp-editor');
        const selectTarget = q('.sp-select-target');
        const keyboard = q('.sp-keyboard');
        const aiWindow = q('.sp-ai-window');
        const aiMsgs = qAll('.sp-ai-msg');

        if (editor) { editor.classList.remove('sp-visible'); }
        if (selectTarget) { selectTarget.classList.remove('sp-selecting', 'sp-selected'); }
        if (keyboard) { keyboard.classList.remove('sp-kb-visible', 'sp-kb-pressed'); }
        if (aiWindow) { aiWindow.classList.remove('sp-ai-visible'); }
        aiMsgs.forEach(m => m.classList.remove('sp-msg-visible'));

        // Phase 2 elements
        const pad = q('.sp-pad');
        const docText = q('.sp-doc-text');
        const toolBtns = qAll('.sp-tool-btn');

        if (pad) { pad.classList.remove('sp-pad-visible'); }
        if (docText) { docText.classList.remove('sp-doc-visible'); }
        toolBtns.forEach(b => b.classList.remove('sp-tool-active'));

        // Panels
        const summary = q('.sp-summary');
        const learn = q('.sp-learn');
        const maps = q('.sp-maps');

        if (summary) { summary.classList.remove('sp-panel-visible'); }
        if (learn) { learn.classList.remove('sp-panel-visible'); }
        if (maps) { maps.classList.remove('sp-panel-visible'); }

        // Map elements
        qAll('.sp-node').forEach(n => n.classList.remove('sp-node-visible'));
        qAll('.sp-map-line').forEach(l => l.classList.remove('sp-line-visible'));
        qAll('.sp-map-label').forEach(l => l.classList.remove('sp-label-visible'));
        const mapCard = q('.sp-map-card');
        if (mapCard) { mapCard.classList.remove('sp-card-visible'); }
    }

    function activateTool(name) {
        qAll('.sp-tool-btn').forEach(b => b.classList.remove('sp-tool-active'));
        const btn = q(`.sp-tool-btn[data-tool="${name}"]`);
        if (btn) btn.classList.add('sp-tool-active');
    }

    function hideAllPanels() {
        const summary = q('.sp-summary');
        const learn = q('.sp-learn');
        const maps = q('.sp-maps');
        if (summary) summary.classList.remove('sp-panel-visible');
        if (learn) learn.classList.remove('sp-panel-visible');
        if (maps) maps.classList.remove('sp-panel-visible');
    }

    function runAnimation() {
        clearAllTimers();
        resetAll();

        // Phase 1: Show editor
        schedule(() => {
            q('.sp-editor').classList.add('sp-visible');
        }, 300);

        // Select text
        schedule(() => {
            q('.sp-select-target').classList.add('sp-selecting');
        }, TIMINGS.SELECT_START);

        schedule(() => {
            q('.sp-select-target').classList.remove('sp-selecting');
            q('.sp-select-target').classList.add('sp-selected');
        }, TIMINGS.SELECT_DONE);

        // Keyboard shortcut
        schedule(() => {
            q('.sp-keyboard').classList.add('sp-kb-visible');
        }, TIMINGS.KEYBOARD_SHOW);

        schedule(() => {
            q('.sp-keyboard').classList.add('sp-kb-pressed');
        }, TIMINGS.KEYBOARD_PRESS);

        schedule(() => {
            q('.sp-keyboard').classList.remove('sp-kb-visible', 'sp-kb-pressed');
        }, TIMINGS.KEYBOARD_HIDE);

        // AI window appears
        schedule(() => {
            q('.sp-ai-window').classList.add('sp-ai-visible');
        }, TIMINGS.AI_SHOW);

        // AI messages
        schedule(() => {
            q('.sp-ai-msg-1').classList.add('sp-msg-visible');
        }, TIMINGS.AI_MSG1);

        schedule(() => {
            q('.sp-ai-msg-2').classList.add('sp-msg-visible');
        }, TIMINGS.AI_MSG2);

        schedule(() => {
            q('.sp-ai-msg-3').classList.add('sp-msg-visible');
        }, TIMINGS.AI_MSG3);

        // Close AI
        schedule(() => {
            q('.sp-ai-window').classList.remove('sp-ai-visible');
        }, TIMINGS.AI_CLOSE);

        // Hide editor
        schedule(() => {
            q('.sp-editor').classList.remove('sp-visible');
        }, TIMINGS.EDITOR_HIDE);

        // Phase 2: Show Scratchpad
        schedule(() => {
            q('.sp-pad').classList.add('sp-pad-visible');
        }, TIMINGS.PAD_SHOW);

        // Document text appears
        schedule(() => {
            q('.sp-doc-text').classList.add('sp-doc-visible');
        }, TIMINGS.DOC_TEXT);

        // Summary
        schedule(() => {
            activateTool('summary');
        }, TIMINGS.SUMMARY_ACTIVE);

        schedule(() => {
            hideAllPanels();
            q('.sp-summary').classList.add('sp-panel-visible');
        }, TIMINGS.SUMMARY_SHOW);

        // Learn
        schedule(() => {
            activateTool('learn');
        }, TIMINGS.LEARN_ACTIVE);

        schedule(() => {
            hideAllPanels();
            q('.sp-learn').classList.add('sp-panel-visible');
        }, TIMINGS.LEARN_SHOW);

        // Maps
        schedule(() => {
            activateTool('map');
        }, TIMINGS.MAPS_ACTIVE);

        schedule(() => {
            hideAllPanels();
            q('.sp-maps').classList.add('sp-panel-visible');
        }, TIMINGS.MAPS_SHOW);

        // Map nodes appear one by one
        const nodes = qAll('.sp-node');
        const lines = qAll('.sp-map-line');
        const labels = qAll('.sp-map-label');

        nodes.forEach((node, i) => {
            schedule(() => {
                node.classList.add('sp-node-visible');
            }, TIMINGS.MAPS_NODES + i * 200);
        });

        lines.forEach((line, i) => {
            schedule(() => {
                line.classList.add('sp-line-visible');
            }, TIMINGS.MAPS_NODES + 200 + i * 150);
        });

        labels.forEach((label, i) => {
            schedule(() => {
                label.classList.add('sp-label-visible');
            }, TIMINGS.MAPS_NODES + 400 + i * 150);
        });

        // Map card popup
        schedule(() => {
            q('.sp-map-card').classList.add('sp-card-visible');
        }, TIMINGS.MAPS_CARD);

        // Loop
        schedule(() => {
            resetAll();
            schedule(runAnimation, 500);
        }, TIMINGS.LOOP_RESET);
    }

    // Intersection Observer - only animate when visible
    function init() {
        container = document.querySelector('.sp-demo');
        if (!container) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    runAnimation();
                } else {
                    clearAllTimers();
                    resetAll();
                }
            });
        }, { threshold: 0.2 });

        observer.observe(container);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
