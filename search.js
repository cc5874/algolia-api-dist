(function () {
    'use strict';

    // Use global variables from CDN
    // The CDN script exposes it as window["algoliasearch/lite"]
    const algoliasearchLite = window['algoliasearch/lite'];
    const algoliasearch = algoliasearchLite?.liteClient || algoliasearchLite;
    // Replace with the name of your index.
    const indexNamePrefix = 'research-poc';
    const indexName = `${indexNamePrefix}-en`;
    if (typeof algoliasearch !== 'function') {
        throw new Error('algoliasearch function not found. Make sure the CDN script is loaded correctly.');
    }
    const searchClient = algoliasearch('OS7P49XJGU', '8a547a03e46e8b21bec4b1d4dbb0de66');
    // Wait for DOM to be ready
    document.addEventListener('DOMContentLoaded', () => {
        // Check if instantsearch is available
        const instantsearch = window.instantsearch;
        if (!instantsearch) {
            return;
        }
        // Render the InstantSearch.js wrapper
        const search = instantsearch({
            indexName,
            searchClient,
            initialUiState: {
                indexName: {
                    query: '',
                },
            },
        });
        search.addWidgets([
            instantsearch.widgets.searchBox({
                container: '#searchbox',
                placeholder: 'Search for anything...',
                searchAsYouType: true, // Enable search as you type
                showReset: false, // Hide the reset button
                showSubmit: false, // Hide the submit button
                showLoadingIndicator: true, // Show loading indicator
            }),
            instantsearch.widgets.hits({
                container: '#hits',
                showPrevious: false,
                templates: {
                    item: (hit) => `
          <div class="hit">
            <div class="hit-title">${hit.name}</div>
            <div class="hit-description">${hit.description}</div>
            <button class="hit-debug-toggle" onclick="toggleDebug(this)">Show raw</button>
            <div class="hit-debug">${JSON.stringify(hit, null, 2)}</div>
          </div>
        `,
                    empty: (data) => {
                        if (data.query) {
                            return `<div class="no-results">No results found for "<em>${data.query}</em>"</div>`;
                        }
                        else {
                            return '<div class="no-results">Start typing to search...</div>';
                        }
                    },
                },
            }),
            instantsearch.widgets.index({ indexName }).addWidgets([
                instantsearch.widgets.configure({
                    hitsPerPage: 16,
                }),
                // instantsearch.widgets.hits({
                //   container: '#hits-en',
                //   templates: {
                //     item: (hit: any) => `
                //       <div class="hit">
                //         <div class="hit-title">${hit.objectID}</div>
                //         <div class="hit-description">${JSON.stringify(hit)}</div>
                //       </div>
                //     `,
                //   },
                // }),
            ]),
            // Add a stats widget to show search state
            instantsearch.widgets.stats({
                container: '#stats',
                templates: {
                    text: (data) => {
                        if (data.nbHits === 0) {
                            return 'Start typing to search...';
                        }
                        return `${data.nbHits} result${data.nbHits !== 1 ? 's' : ''} found`;
                    },
                },
            }),
        ]);
        search.start();
        // Add event listeners for search box behavior
        const searchBox = document.querySelector('#searchbox');
        if (searchBox) {
            searchBox.addEventListener('input', event => {
                const value = event.target.value;
                // Manually trigger search to test if that works
                if (value.trim() !== '') {
                    search.helper?.setQuery(value).search();
                }
            });
        }
        // Add event listener for language selector
        const languageSelector = document.querySelector('#language-selector');
        if (languageSelector) {
            languageSelector.addEventListener('change', event => {
                const selectedLanguage = event.target.value;
                // Update the search index based on language
                const newIndexName = `${indexNamePrefix}-${selectedLanguage}`;
                // Update the search instance with new index
                if (search.helper) {
                    search.helper.setIndex(newIndexName).search();
                }
            });
        }
    });
    // Global function to toggle debug information
    window.toggleDebug = function (button) {
        const debugElement = button.nextElementSibling;
        if (debugElement && debugElement.classList.contains('hit-debug')) {
            debugElement.classList.toggle('active');
            button.textContent = debugElement.classList.contains('active')
                ? 'Hide raw'
                : 'Show raw';
        }
    };

})();
//# sourceMappingURL=search.js.map
