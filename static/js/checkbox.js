/**
 * Created by VectoR on 27-01-2018.
 */
$(document).ready(function () {
  $('.checkAll').on('click', function () {
    $(this).closest('table').find('tbody :checkbox')
      .prop('checked', this.checked)
      .closest('tr').toggleClass('selected', this.checked);
    
    if($(this).prop('checked')) {
      $('#download-btn').removeClass('btn-inactive').prop('disabled',false);
      $('#delete-modal-btn').removeClass('btn-inactive').prop('disabled',false);
      
      if($('.checkbox:checked').length==1) {
        $('#rename-modal-btn').removeClass('btn-inactive').prop('disabled',false);
        $('#replace-modal-btn').removeClass('btn-inactive').prop('disabled',false);
        $('#get-link-btn').removeClass('btn-inactive').prop('disabled',false);
      }
	  } else {
	  	$('#rename-modal-btn').addClass('btn-inactive').prop('disabled', true);
      $('#replace-modal-btn').addClass('btn-inactive').prop('disabled', true);
      $('#download-btn').addClass('btn-inactive').prop('disabled', true);
      $('#get-link-btn').addClass('btn-inactive').prop('disabled', true);
      $('#delete-modal-btn').addClass('btn-inactive').prop('disabled',true);
    }
  });

  $('tbody :checkbox').on('click', function () {
    $(this).closest('tr').toggleClass('selected', this.checked); //Classe de seleção na row

    $(this).closest('table').find('.checkAll').prop('checked', ($(this).closest('table').find('tbody :checkbox:checked').length == $(this).closest('table').find('tbody :checkbox').length)); //Tira / coloca a seleção no .checkAll
  });
});

