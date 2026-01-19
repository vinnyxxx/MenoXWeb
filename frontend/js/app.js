"use strict";
// Main application logic
console.log('MenoX - AI Text Assistant for macOS');
// API Configuration
const API_BASE_URL = 'https://6wcydyo6tb.execute-api.us-west-2.amazonaws.com/prod';
// ============================================
// Theme Management
// ============================================
/**
 * Apply theme based on visitor's local time
 * Day theme: 6 AM - 6 PM (local time)
 * Night theme: 6 PM - 6 AM (local time)
 * Can be overridden with ?theme=day or ?theme=night URL parameter
 */
function applyTimeBasedTheme() {
    const urlParams = new URLSearchParams(window.location.search);
    const themeParam = urlParams.get('theme');
    
    // Allow URL parameter override for testing
    if (themeParam === 'day') {
        document.body.classList.add('day-theme');
        console.log('Day theme forced via URL parameter');
        return;
    } else if (themeParam === 'night') {
        document.body.classList.remove('day-theme');
        console.log('Night theme forced via URL parameter');
        return;
    }
    
    const now = new Date();
    const localHours = now.getHours();
    // Apply day theme between 6 AM and 6 PM local time
    if (localHours >= 6 && localHours < 18) {
        document.body.classList.add('day-theme');
        console.log(`Day theme applied (Local hour: ${localHours})`);
    }
    else {
        document.body.classList.remove('day-theme');
        console.log(`Night theme applied (Local hour: ${localHours})`);
    }
}
/**
 * Fetch download statistics
 */
async function fetchDownloadStats() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/downloads/stats`);
        const data = await response.json();
        const countElement = document.getElementById('download-count');
        if (countElement && data.success) {
            countElement.textContent = data.totalDownloads.toLocaleString();
        }
    }
    catch (error) {
        console.error('Failed to fetch download stats:', error);
        const countElement = document.getElementById('download-count');
        if (countElement) {
            countElement.textContent = '0';
        }
    }
}
/**
 * Record download event
 */
async function recordDownload() {
    try {
        await fetch(`${API_BASE_URL}/api/downloads`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        // Refresh stats after download
        await fetchDownloadStats();
    }
    catch (error) {
        console.error('Failed to record download:', error);
    }
}
/**
 * Initialize download functionality
 */
function initDownload() {
    // Fetch initial stats
    fetchDownloadStats();
    // Handle download button click
    const downloadBtn = document.getElementById('download-btn');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            // Record download stat
            await recordDownload();
            // Start download
            window.location.href = 'https://menox.us/downloads/MenoX.dmg';
        });
    }
}
// ============================================
// Forum Functionality
// ============================================
/**
 * Fetch forum threads
 */
async function fetchForumThreads() {
    const threadsContainer = document.getElementById('forum-threads');
    if (!threadsContainer)
        return;
    try {
        const response = await fetch(`${API_BASE_URL}/api/messages`);
        const data = await response.json();
        if (data.success && data.threads && data.threads.length > 0) {
            threadsContainer.innerHTML = data.threads.map(thread => `
        <div class="thread-item">
          <div class="thread-header">
            <h3 class="thread-title">${escapeHtml(thread.title)}</h3>
          </div>
          <div class="thread-content">${escapeHtml(thread.content)}</div>
          <div class="thread-footer">
            <span class="thread-author">Posted by ${escapeHtml(thread.author)}</span>
            <span class="thread-time">${formatTime(thread.timestamp)}</span>
          </div>
        </div>
      `).join('');
        }
        else {
            threadsContainer.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">💬</div>
          <p>No discussions yet. Be the first to start one!</p>
        </div>
      `;
        }
    }
    catch (error) {
        console.error('Failed to fetch forum threads:', error);
        threadsContainer.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">⚠️</div>
        <p>Failed to load discussions. Please try again later.</p>
      </div>
    `;
    }
}
/**
 * Post new forum thread
 */
async function postForumThread(title, content) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/messages`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title,
                content,
                author: 'Anonymous', // TODO: Add user authentication
            }),
        });
        const data = await response.json();
        return data.success;
    }
    catch (error) {
        console.error('Failed to post thread:', error);
        return false;
    }
}
/**
 * Initialize forum functionality
 */
function initForum() {
    // Fetch initial threads
    fetchForumThreads();
    // Handle form submission
    const forumForm = document.getElementById('forum-form');
    const titleInput = document.getElementById('thread-title');
    const contentInput = document.getElementById('thread-content');
    const charCount = document.getElementById('char-count');
    if (contentInput && charCount) {
        contentInput.addEventListener('input', () => {
            charCount.textContent = contentInput.value.length.toString();
        });
    }
    if (forumForm && titleInput && contentInput) {
        forumForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const title = titleInput.value.trim();
            const content = contentInput.value.trim();
            if (!title || !content) {
                alert('Please fill in both title and content');
                return;
            }
            const submitBtn = forumForm.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = 'Posting...';
            }
            const success = await postForumThread(title, content);
            if (success) {
                titleInput.value = '';
                contentInput.value = '';
                if (charCount)
                    charCount.textContent = '0';
                await fetchForumThreads();
                alert('Discussion posted successfully!');
            }
            else {
                alert('Failed to post discussion. Please try again.');
            }
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Post Discussion';
            }
        });
    }
}
// ============================================
// Utility Functions
// ============================================
/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
/**
 * Format timestamp to relative time
 */
function formatTime(timestamp) {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (minutes < 1)
        return 'Just now';
    if (minutes < 60)
        return `${minutes}m ago`;
    if (hours < 24)
        return `${hours}h ago`;
    if (days < 7)
        return `${days}d ago`;
    return new Date(timestamp).toLocaleDateString();
}
// ============================================
// Application Initialization
// ============================================
/**
 * Initialize all functionality
 */
function initApp() {
    applyTimeBasedTheme();
    initDownload();
    initForum();
}
// Initialize after DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
}
else {
    initApp();
}
