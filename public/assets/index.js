$("#submit-button").click(function(e) {

  e.preventDefault();

  const input = $("#channel-input")
  const btn = $("#submit-button")

  if((input.attr("class") || "").indexOf("active") >= 0) {
    btn.removeClass("active")
    input.removeClass("active")
  } else {
    btn.addClass("active")
    input.addClass("active")
  }
})

function openNewChannel (channel) {
  $.get(`/isopen/${channel}`, function( data ) {
    if(!data.open)
      window.open(`/?channel=${channel}`, "_blank")
  });
}


// Output Welcome message
output('')

// User Commands
function echo (...a) {
  return a.join(' ')
}
echo.usage = "echo arg [arg ...]"
echo.doc = "Echos to output whatever arguments are input"

var cmds = {
  echo,
  clear,
  help
}

/*
 * * * * * * * * USER INTERFACE * * * * * * *
 */

function clear () {
  $("#outputs").html("")
}
clear.usage = "clear"
clear.doc = "Clears the terminal screen"

function help (cmd) {
  if (cmd) {
    let result = ""
    let usage = cmds[cmd].usage
    let doc = cmds[cmd].doc
    result += (typeof usage === 'function') ? usage() : usage
    result += "\n"
    result += (typeof doc === 'function') ? doc() : doc
    return result
  } else {
    let result = "**Commands:**\n\n"
    print = Object.keys(cmds)
    for (let p of print) {
      result += "- " + p + "\n"
    }
    return result
  }
}
help.usage = () => "help [command]"
help.doc = () => "Without an argument, lists available commands. If used with an argument displays the usage & docs for the command."

// Set Focus to Input
$('.console').click(function() {
  $('.console-input').focus()
})

// Display input to Console
function input() {
  var cmd = $('.console-input').val()
  $("#outputs").append("<div class='output-cmd'>" + cmd + "</div>")
  $('.console-input').val("")
  autosize.update($('textarea'))
  $("html, body").animate({
    scrollTop: $(document).height()
  }, 300);
  return cmd
}

// Output to Console
function output(print) {

  var render = "<p>" + print + "</p>" + "\n"
  for (var i = 0; i < filter.length; i++) {
    if(print.indexOf(filter[i]) >= 0){
      render = "<p class='highlight-error'>" + print + "</p>" + "\n"
      const match = print.match(
        new RegExp(`${filter[i]}\(\.\+\?\)\(\\s\)`,"g")
      ) || []
      const newChannel = match[0].replace("Error", "").replace(" ", "")
      openNewChannel(newChannel)
      break;
    }
  }
  $("#outputs").append(render)
  $(".console-inner").scrollTop($('#outputs').height());
}

// Break Value
var newLine = "<br/> &nbsp;";

autosize($('textarea'))

var cmdHistory = []
var cursor = -1

function getCurrentDateTime () {
    const today = new Date();
    const yyyy = today.getFullYear();
    var mm = today.getMonth() + 1; // Months start at 0!
    var dd = today.getDate();
    var hh = today.getHours();
    var mins = today.getMinutes();
    var sec = today.getSeconds();

    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;
    if (hh < 10) hh = '0' + hh;
    if (sec < 10) sec = '0' + sec;
    if (mins < 10) mins = '0' + mins;

    const formattedToday = yyyy + '.' + mm + '.' + dd + ' ' + hh + ':' + mins + ':' + sec;
    return formattedToday
}

//ParticlesBG
particlesJS('particles-js',{'particles':{'number':{'value':50},'color':{'value':'#ffffff'},'shape':{'type':'triangle','polygon':{'nb_sides':5}},'opacity':{'value':0.06,'random':false},'size':{'value':11,'random':true},'line_linked':{'enable':true,'distance':150,'color':'#ffffff','opacity':0.4,'width':1},'move':{'enable':true,'speed':4,'direction':'none','random':false,'straight':false,'out_mode':'out','bounce':false}},'interactivity':{'detect_on':'canvas','events':{'onhover':{'enable':false},'onclick':{'enable':true,'mode':'push'},'resize':true},'modes':{'push':{'particles_nb':4}}},'retina_detect':true},function(){});