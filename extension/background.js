// reference: https://github.com/buunguyen/octotree/blob/master/src%2Fchrome%2Fbackground.js
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (changeInfo.status !== 'loading') return

  chrome.tabs.executeScript(tabId, {
    code  : 'var injected = window.octotreeInjected; window.octotreeInjected = true; injected;',
    runAt : 'document_start'
  }, function(res) {
    if (chrome.runtime.lastError || // don't continue if error (i.e. page isn't in permission list)
        res[0]) // value of `injected` above: don't inject twice
      return

    var cssFiles = [
      'inject.css'
    ]

    var jsFiles = [
      'jquery.js',
      'inject.js'
    ]
    /*'jquery-ui.js',
    'jquery.pjax.js',
    'jstree.js',
    'keymaster.js',
    'octotree.js'*/

    eachTask([
      function(cb) {
        eachItem(cssFiles, inject('insertCSS'), cb)
      },
      function(cb) {
        eachItem(jsFiles, inject('executeScript'), cb)
      }
    ])

    function inject(fn) {
      return function(file, cb) {
        chrome.tabs[fn](tabId, { file: file, runAt: 'document_start' }, cb)
      }
    }
  })
})

function eachTask(tasks, done) {
  next(0)
  function next(index) {
    if (index === tasks.length) done && done()
    else tasks[index](function() { next(index + 1) })
  }
}

function eachItem(arr, iter, done) {
  var tasks = arr.map(function(item) {
    return function(next) {
      iter(item, next)
    }
  })
  return eachTask(tasks, done)
}