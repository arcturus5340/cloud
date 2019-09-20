/**
 * Created by VectoR on 26-01-2018.
 */
jQuery(document).ready(function($) {
    $(".clickable-row").click(function() {
        window.location = $(this).closest('tr').data("href");
    });
     $('.file-info-button').click(function(event) {

        var path = $(this).attr('data-href');

        $('#file-info .modal-filename').text('Loading...');
        $('#file-info .modal-filesize').text('Loading...');
        $('#file-info .modal-filedate').text('Loading...');
        $('#file-info .modal-url').text('Loading...');
        $('#file-info .modal-filepath').text('Loading...');

        $.ajax({
            url:      path + '&format=json',
            type:    'get',
            success: function(data) {

                var obj = jQuery.parseJSON(data);

                $('#file-info-modal .modal-title').text(obj.filename);
                $('#file-info .modal-filename').text(obj.filename);
                $('#file-info .modal-filesize').text(obj.filesize);
                $('#file-info .modal-filedate').text(obj.filedate);
                $('#file-info .modal-url').text(obj.fileurl);
                $('#file-info .modal-filepath').text(obj.filepath);

            }
        });

        $('#file-info-modal').modal('show');

        event.preventDefault();

    });

     $('#delete-modal-btn').click(function(event) {
        var path = $(this).data('href');
        var files = [];
        var fa_html = [];
        $('.checkbox:checked').each(function () {
            files.push($(this).data('path'));
            fa_html.push($(this).closest('tr').find('span').html())
        });

        $('.modal-title').html('<b> Вы уверены, что хотите удалить данные файлы/папки? </b>');

        $('#remove-modal').modal('show');

        for(i=0;i<files.length;i++){
            $('.container').append('<div class="row"><div class="col-xs-1"><span class="pull-right">' + fa_html[i] + '</span></div><div class="col-xs-3">'+files[i]+'</div></div>');
        }


        $('#remove-files').click(function (event) {
            $.ajax({
                url: path,
                contentType: "application/json",
                type:    'post',
                data: JSON.stringify({'files': files}),
                success: function(data) {
                    location.reload();
                }
            });

            event.preventDefault();
        });




    });
         $('#create-directory-btn').click(function () {
         var path = $(this).data('href');
         $.ajax({
            url:   path ,
            type:    'get',

        });
          $('#create-directory .modal-title').html('Путь : <b> /'+path.split('=')[1] +'</b>');
          $('#create-directory').modal('show');

        // Prevent default link action
        event.preventDefault();
     });

      $('#upload-modal-btn').click(function () {
         var path = $(this).data('href');
         $.ajax({
            url:   path ,
            type:  'get',

        });
          $('#upload-modal .modal-title').html('Путь : <b> /'+path.split('=')[1] +'</b>');
          $('#upload-modal').modal('show');

        // Prevent default link action
        event.preventDefault();
     });
    $('#fileupload').fileupload({
        
        dataType: 'json',
        dropZone: $("#upload-modal"),
        start: function (e) {
            var strProgress = 0 + "%";
            $("#progress-percent").css({"width": strProgress});
            $("#progress-percent").text(strProgress);
        },

        add: function (e, data) {
            var jqXHR = data.submit();
        },

        done: function(e, data) {
            $.each(data.result.files, function (index, file) {
                $("#show-files").append('<tr><td>'+file.name+'</tr></td>')
            });
            $('#upload-btn').click(function () {
                location.reload();
            });
        },

        progressall: function (e, data) {
            var progress = parseInt(data.loaded / data.total * 100, 10);
            var strProgress = progress + "%";
            $("#progress-percent").css({"width": strProgress});
            $("#progress-percent").text(strProgress);
        }
    });

    $('#upload-modal').on('hidden.bs.modal', function () {
        location.reload();
    });

    $('#remove-modal').on('hidden.bs.modal', function () {
        location.reload();
    });

       $('#rename-modal-btn').click(function () {
         if($('.checkbox:checked').length==1){
             var path = $(this).data('href');
             $.ajax({
                url:     path ,
                type:    'get'

            });
              var filename = $(".checkbox:checked").closest('tr').find('.clickable-row').text();
              $('#rename-modal .modal-title').html('Переименовать : <b>'+ filename +'</b>');
              $('#rename-modal').modal('show');

              $('#rename-form').on('submit', function () {

                var input = $("<input>")
                   .attr("type", "hidden")
                   .attr("name", "old_name").val(filename);

                $('#rename-form').append($(input));
             });
         }
    });

       $('#replace-modal-btn').click(function () {
         if($('.checkbox:checked').length==1){
            /* var path = $(this).data('href');
             $.ajax({
                url:     path ,
                type:    'get'

            });
              var filename = $(".checkbox:checked").closest('tr').find('.clickable-row').text();
              $('#replace-modal .modal-title').html('Переместить : <b>'+ filename +'</b>');
              $('#replace-modal').modal('show');

              $('#replace-form').on('submit', function () {

                var input = $("<input>")
                   .attr("type", "hidden")
                   .attr("name", "old_path").val(filename);

                $('#replace-form').append($(input));
             });*/
         }
    });

         $('.checkbox').on('click', function () {
             on_checkbox_selected();
         });

         $('#rename-modal-btn').prop('disabled',true);
         $('#replace-modal-btn').prop('disabled',true);
         $('#download-btn').prop('disabled',true);
         $('#delete-modal-btn').prop('disabled',true);

         var urlParams = new URLSearchParams(window.location.search);
          var q = urlParams.get('path');
          if(q!=null){
              var hiddenVar='<input type="hidden" name="path" value='+q+'>';
              $('#searchform').append(hiddenVar);
          }

    });

function on_checkbox_selected() {
            
            var checkbox_count = 0;
            var checkboxes = $(".checkbox");
            checkboxes.each(function(e) {
                checkbox_count = checkbox_count + 1;
            });

            var checkbox = $(".checkbox:checked");
            if(checkbox.length>0){
                $('#download-btn').removeClass('btn-inactive').prop('disabled',false);
                $('#delete-modal-btn').removeClass('btn-inactive').prop('disabled',false);
                
                if(checkbox.length==1) {
                    $('#rename-modal-btn').removeClass('btn-inactive').prop('disabled',false);
                    $('#replace-modal-btn').removeClass('btn-inactive').prop('disabled',false);
                    $('#get-link-btn').removeClass('btn-inactive').prop('disabled',false);
                    $('.checkAll').prop('checked', false);
                } else {
                    $('#rename-modal-btn').addClass('btn-inactive').prop('disabled',true);
                    $('#replace-modal-btn').addClass('btn-inactive').prop('disabled',true);
                    $('#get-link-btn').addClass('btn-inactive').prop('disabled',true);
                }

                if (checkbox.length < checkbox_count) {
                    $('.checkAll').prop('checked', false);
                } else {
                    $('.checkAll').prop('checked', true);
                }
            } else {
                 $('.checkAll').prop('checked', false);
                 $('#rename-modal-btn').addClass('btn-inactive').prop('disabled', true);
                 $('#replace-modal-btn').addClass('btn-inactive').prop('disabled', true);
                 $('#download-btn').addClass('btn-inactive').prop('disabled', true);
                 $('#get-link-btn').addClass('btn-inactive').prop('disabled', true);
                 $('#delete-modal-btn').addClass('btn-inactive').prop('disabled',true);

            }
  }


