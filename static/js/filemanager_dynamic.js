$(document).ready(function() {
  $('.checkAll').prop('checked', false);
  $(".checkbox:checked").each(function () {
    $(this).prop('checked', false);
  });
  var replace = Cookies.get('replace');
  if(replace) {
    replaceStatus();
  }
});

$(".download-item").mousemove(function() {
  $(this).find(".download-img").attr('src', '/static/img/download-btn-hover.png')
});

$(".download-item").mouseleave(function() {
  $(this).find(".download-img").attr('src', '/static/img/download-btn.png')
});

$(".link-item").mousemove(function() {
  $(this).attr('src', '/static/img/link-hover.png')
});

$(".link-item").mouseleave(function() {
  $(this).attr('src', '/static/img/link.png')
});

$(".support").mousemove(function() {
  $(this).find(".support-img").attr('src', '/static/img/support-hover.png')
});

$(".support").mouseleave(function() {
  $(this).find(".support-img").attr('src', '/static/img/support.png')
});

function replaceStatus() {
  $('.rename-modal-th').hide();
  $('.create-directory-th').hide();
  $('.upload-th').hide();
  $('.download-th').hide();
  $('.get-link-th').hide();
  $('.delete-modal-th').hide();
  $('.replace-modal-th').hide();
  $('.replace-here-th').show();
  $('.fm-table').css('width', '114.5%');
}

$('#replace-modal-btn').click(function () {
  if($('.checkbox:checked').length==1){
    replaceStatus();
    Cookies.set('replace', $('.checkbox:checked').data("path"));
  }
});

$('.link-modal-btn').click(function () {

  $('.added').each(function() {
    $(this).remove();
  });
  $("#saved").css('display', 'none');

  var filename = $(this).attr('data');
  var url = $(this).data('url');
  var link = $(this).data('link');
  var blocked = $(this).data('blocked');
  var url_access = $(this).data('url-access');
  var allowed_urls = $(this).data('allowed-urls');
  
  if(allowed_urls) {
    var urls = allowed_urls.split(", ");
    var length = urls.length;
    for(var i = 0; i < length; i++) {
      if(i == 0) {
        $("#id_input_file_url").val(urls[i]);
      } else {
        $( ".url-div" ).append('<input type="text" class="form-control urls added" placeholder="" aria-label="" name="input_file_url" required id="id_input_file_url" aria-describedby="button-addon2" style="float:left; margin-right: 10px; margin-bottom: 20px;" value="' + urls[i] + '"></input>');
      }
    }
  } else {
    $("#id_input_file_url").val("");
  }
  
  if(blocked === 0) {
    $("#link-access-btn .toggle").removeClass("off");
  } else {
    $("#link-access-btn .toggle").addClass("off");
  }

  if(url_access === 1) {
    $("#link-url-btn .toggle").removeClass("off");
  } else {
    $("#link-url-btn .toggle").addClass("off");
  }

  $("#id_input_file_link").val(link);

  $('#link-modal .modal-title').html('Ссылка на папку "<b>'+ filename +'</b>"');
  $("#link-modal #link-access-btn").attr('data', url);
  $("#link-modal #link-url-btn").attr('data', url);
  $("#save-urls").attr('data', url);
  $('#link-modal').modal('show');
});

$("#copy-button").click(function() {
  var copyTextarea = document.querySelector('#id_input_file_link');
  copyTextarea.focus();
  copyTextarea.select();

  try {
    var successful = document.execCommand('copy');
    var msg = successful ? 'successful' : 'unsuccessful';
    console.log('Copying text command was ' + msg);
  } catch (err) {
    console.log('Oops, unable to copy');
  }
});

$('#get-link-btn').click(function () {
  if($('.checkbox:checked').length==1){
    $('.added').each(function() {
      $(this).remove();
    });

    $("#saved").css('display', 'none');

    var filename = $('.checkbox:checked').attr('data');
    var url = $('.checkbox:checked').data('path');
    var link = $('.checkbox:checked').data('link');
    var blocked = $('.checkbox:checked').data('blocked');
    var url_access = $('.checkbox:checked').data('url-access');
    var allowed_urls = $('.checkbox:checked').data('allowed-urls');
    
    if(allowed_urls) {
      var urls = allowed_urls.split(", ");
      var length = urls.length;
      for(var i = 0; i < length; i++) {
        if(i == 0) {
          $("#id_input_file_url").val(urls[i]);
        } else {
          $( ".url-div" ).append('<input type="text" class="form-control urls added" placeholder="" aria-label="" name="input_file_url" required id="id_input_file_url" aria-describedby="button-addon2" style="float:left; margin-right: 10px; margin-bottom: 20px;" value="' + urls[i] + '"></input>');
        }
      }
    }

    if(blocked == "0") {
      $("#link-access-btn .toggle").removeClass("off");
    }

    if(url_access == "1") {
      $("#link-url-btn .toggle").removeClass("off");
    }

    $("#id_input_file_link").val(link);

    $('#link-modal .modal-title').html('Ссылка на папку "<b>'+ filename +'</b>"');
    $("#link-modal #link-access-btn").attr('data', url);
    $("#link-modal #link-url-btn").attr('data', url);
    $("#save-urls").attr('data', url);
    $('#link-modal').modal('show');
  }
});

$('#auth-modal-btn').click(function (e) {
  e.preventDefault();
  $('#auth-modal').modal('show');
});

$("#link-access-btn").click(function() {
  if($(this).find('div.off').length !== 0) {
    $.post("/unblock/", {'path':$(this).attr('data'), 'csrfmiddlewaretoken': $("input[name=csrfmiddlewaretoken]").val()});
  } else {
    $.post("/block/", {'path':$(this).attr('data'), 'csrfmiddlewaretoken': $("input[name=csrfmiddlewaretoken]").val()});
  }
});

$("#link-url-btn").click(function() {
  if($(this).find('div.off').length !== 0) {
    $.post("/access_to_url/", {'path':$(this).attr('data'), 'csrfmiddlewaretoken': $("input[name=csrfmiddlewaretoken]").val()});
  } else {
    $.post("/unaccess_to_url/", {'path':$(this).attr('data'), 'csrfmiddlewaretoken': $("input[name=csrfmiddlewaretoken]").val()});
  }
});

$("#save-urls").click(function(e) {
  var urls = [];
  $(".urls").each(function() {
    urls.push($(this).val());
  });
  e.preventDefault();
  $.post("/save-urls/", {'urls' : urls, 'path' : $(this).attr('data'), 'csrfmiddlewaretoken': $("input[name=csrfmiddlewaretoken]").val()});
  $("#saved").show();
});

$(".add-url-input").click(function(e) {
  $( ".url-div" ).append('<input type="text" class="form-control urls added" name="input_file_url" style="float:left; margin-right: 10px; margin-bottom: 20px;"></input>');
});

$(".search-input").click(function(e) {
  $(this).css("opacity", "1");
});

$(document).mouseup(function (e){
  var div = $(".search-input");
  if (!div.is(e.target) && div.has(e.target).length === 0) {
    $(".search-input").css("opacity", "0.7");
  }
});

$('#login_button').on("click", function(e) {
  e.preventDefault();
  $('#error-login').hide();
  $.ajax({
    type: "POST",
    url: './',
    data: {
      'username': $('#id_username').val(),
      'password': $('#id_password').val(),
      'login': $('#id_login').val(),
      'csrfmiddlewaretoken': $("input[name=csrfmiddlewaretoken]").val(),
    },
    success: function(response) {
        if (response['result'] === "Success!") {
            let url = "/";
            $(location).attr('href', url);
        } else {
            $('#error-login').show();
        }
    }
  });
});

$('#logout_button').on("click", function(e) {
  e.preventDefault();
  $.ajax({
    type: "POST",
    url: './',
    data: {
      'logout': "logout",
      'csrfmiddlewaretoken': $("input[name=csrfmiddlewaretoken]").val(),
    },
    success: function(response) {
        if (response['result'] === "Success!") {
            let url = "/";
            $(location).attr('href', url);
        } else {
            $('#error-login').show();
        }
    }
  });
});

$('#link-close').click(function() {
  location.reload();
});