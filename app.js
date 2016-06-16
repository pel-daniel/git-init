var fileName = 'tasks.txt'
var payload1 = {
  hash: 'cc04c1f',
  message: 'Add file ' + fileName
}
var payload2 = {
  hash: 'ff5dac2',
  message: 'Add first task'
}

var commands = {
  1: {
    animation: gitInit
  },
  2: {
    animation: modifyFile,
    payload: {
      fileName: fileName
    }
  },
  3: {
    animation: gitAdd
  },
  4: {
    animation: gitCommit,
    payload: payload1
  },
  5: {
    animation: modifyFile,
    payload: {
      fileName: fileName
    }
  },
  6: {
    animation: gitStatus,
    defaultState: gitStatusDefaultState
  },
  7: {
    animation: gitDiff,
    defaultState: gitDiffDefaultState
  },
  8: {
    animation: gitAdd
  },
  9: {
    animation: gitStatus,
    defaultState: gitStatusDefaultState
  },
  10: {
    animation: gitDiffCached,
    defaultState: gitDiffCachedDefaultState
  },
  11: {
    animation: gitCommit,
    payload: payload2
  },
  12: {
    animation: gitLog,
    defaultState: gitLogDefaultState
  }
}

$(function() {
  $('.next-step').click(transitionToNextStep)
  $('.instructions').on('click', '.command-trigger:not(.animating)', animateCommand)
})

function animateCommand(e) {
  e.preventDefault()
  e.stopPropagation()

  var commandId = $(this).closest('.step').data('id')
  $(this).addClass('animating')

  var command = $.extend(
    {},
    commands[commandId],
    { command: $(this).text().trim(), $element: $(this), id: commandId }
  )

  // 1. show command in console div
  // 2. show animation
  // 3. show command output in console div
  // 4. show the next prompt in console div
  // 5. remove progress cursor from command
  // 6. show link to the next step in instructions div
  showCommand(command)
  .then(function() {
    return command.animation(command.payload)
  }).then(function() {
    return showCommandOutput(command)
  }).then(function() {
    return showNextPrompt(command)
  }).then(function () {
    return removeProgressCursor(command)
  }).then(function() {
    return showLinkToNextStep(command)
  }).catch(function(error) {
    console.log(error)
  })
}

function showCommand(command) {
  var $consoleCommand = $('.console > .step' + command.id + ' > .console-bash-command')

  return new Promise(function(resolve, reject) {
    $consoleCommand.
      text(command.command).
      fadeIn(400, function() {
        $(this).removeClass('hidden')
        resolve()
      })
  })
}

function showCommandOutput(command) {
  var $commandGroup = $('.console > .step' + command.id)

  return new Promise(function(resolve, reject) {
    var $commandOutput = $commandGroup.find('.console-output')

    if($commandOutput.length == 1) {
      $commandOutput.
        fadeIn(400, function() {
          $(this).removeClass('hidden')
          resolve()
        })
    } else {
      resolve()
    }
  })
}

function showNextPrompt(command) {
  return new Promise(function(resolve, reject) {
    var $consoleCommand = $('.console > .step' + (command.id + 1) + ' > .console-prompt')

    $consoleCommand.
      fadeIn(400, function() {
        $(this).removeClass('hidden')
        var $console = $('.console')

        $console.animate(
          { scrollTop: $console.prop('scrollHeight') - $console.outerHeight() },
          400,
          function() {
            resolve()
          }
        )
      })
  })
}

function removeProgressCursor(command) {
  return new Promise(function(resolve, reject) {
    command.$element.toggleClass('animating animated')
    resolve()
  })
}

function showLinkToNextStep(command) {
  return new Promise(function(resolve, reject) {
    $('.instructions > .step' + command.id + ' .next-step').fadeIn(400, function() {
      $(this).removeClass('hidden')
      resolve()
    })
  })
}

function transitionToNextStep(e) {
  e.preventDefault()
  e.stopPropagation()

  var commandId = $(this).closest('.step').data('id')
  var command = commands[commandId]

  var returnToDefault = command.defaultState ?
    command.defaultState() :
    Promise.resolve()

  returnToDefault.then(function() {
    showNextStep(commandId)
  })
}

function showNextStep(commandId) {
  return new Promise(function(resolve, reject) {
    $('.instructions > .step' + commandId).fadeOut(400, function() {
      $('.instructions > .step' + (commandId + 1)).fadeIn(400, function() {
        $(this).removeClass('hidden')
        resolve()
      })
    })
  })
}

function gitAdd() {
  var $file = $('#working-dir > .file')
  var width = $('.area').outerWidth(true)

  if($file.length == 0) {
    return Promise.reject()
  }

  return new Promise(function(resolve, reject) {
    $file.animate(
      { 'background-color': '#388e3c', left: width + 'px' },
      700,
      function() {
        $(this).remove().css('left', 0).appendTo('#staging')
        resolve()
      }
    )
  })
}

function gitCommit(payload) {
  var $staging = $('#staging')

  if($staging.children().length == 0) {
    return Promise.reject()
  }

  var $commit = createCommitHtml(
    payload,
    $staging.height(),
    $staging.width()
  )

  $staging.empty().append($commit)

  return new Promise(function(resolve, reject) {
    $commit.find('.commit-node').animate(
      {
        'border-radius': '50%',
        height: '22px',
        width: '22px'
      },
      500,
      function() {
        var width = $('.area').outerWidth(true)
        var $commitArea = $('#local-repository')

        var $spacer = createSpacerHtml()

        $spacer.delay(400).prependTo($commitArea).slideDown(700)

        $commit.delay(400).animate({ left: width + 'px' }, 700, function() {
          $spacer.remove()
          $(this).css('left', 0).prependTo($commitArea)
          $(this).find('.commit-message').delay(400).fadeIn(400, function() {
            resolve()
          })
        })
      }
    )
  })
}

function gitDiff() {
  return new Promise(function(resolve, reject) {
    $('#working-dir').parent().animate(
      areaHighlightCss(),
      700,
      function() {
        resolve()
      }
    )
  })
}

function gitDiffDefaultState() {
  return new Promise(function(resolve, reject) {
    $('#working-dir').parent().animate(
      areaDefaultCss(),
      700,
      function() {
        resolve()
      }
    )
  })
}

function gitDiffCached() {
  return new Promise(function(resolve, reject) {
    $('#staging').parent().animate(
      areaHighlightCss(),
      700,
      function() {
        resolve()
      }
    )
  })
}

function gitDiffCachedDefaultState() {
  return new Promise(function(resolve, reject) {
    $('#staging').parent().animate(
      areaDefaultCss(),
      700,
      function() {
        resolve()
      }
    )
  })
}

function gitInit() {
  return new Promise(function(resolve, reject) {
    $('.area').removeClass('hidden').animate({ height: '100%' }, 700, function() {
      $('.area-title').fadeIn(400, function() {
        $(this).removeClass('hidden')
        resolve()
      })
    })
  })
}

function gitLog() {
  return new Promise(function(resolve, reject) {
    $('#local-repository').parent().animate(
      areaHighlightCss(),
      700,
      function() {
        resolve()
      }
    )
  })

}

function gitLogDefaultState() {
  return new Promise(function(resolve, reject) {
    $('#local-repository').parent().animate(
      areaDefaultCss(),
      700,
      function() {
        resolve()
      }
    )
  })
}

function gitStatus() {
  return new Promise(function(resolve, reject) {
    $('#working-dir, #staging').parent().animate(
      areaHighlightCss(),
      700,
      function() {
        resolve()
      }
    )
  })
}

function gitStatusDefaultState() {
  return new Promise(function(resolve, reject) {
    $('#working-dir, #staging').parent().animate(
      areaDefaultCss(),
      700,
      function() {
        resolve()
      }
    )
  })
}

function modifyFile(payload) {
  var $file = createFileHtml(payload.fileName)
  $file.appendTo('#working-dir')
  return new Promise(function(resolve, reject) {
    $file.fadeIn(400, function() {
      resolve()
    })
  })
}

function createFileHtml(fileName) {
  var $icon = $('<span/>', { class: 'file-icon octicon octicon-file-text' })
  var $fileName = $('<span/>', { class: 'file-name', text: fileName })

  return $('<div/>', { class: 'file' }).
    append($icon).
    append($fileName).
    hide()
}

function createCommitHtml(payload, height, width) {
  var $commitNode = $('<span/>', {
    class: 'commit-node',
    height: height,
    width: width
  })
  var $message =
    $('<p/>', {
      class: 'commit-message',
      text: payload.hash + ' ' + payload.message
    }).hide()

  return $('<div/>', { class: 'commit' }).append($commitNode).append($message)
}

function createSpacerHtml() {
  return $('<div/>', { height: 32 }).hide()
}

function areaHighlightCss() {
  return {
    'background-color': '#b8dbe6',
    'border-color': 'black',
    'color': 'black'
  }
}

function areaDefaultCss() {
  return {
    'background-color': 'white',
    'border-color': '#303030',
    'color': '#303030'
  }
}
