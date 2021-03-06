if($('#page-profile').length > 0){
  $.ajaxSetup({
    headers: {
      'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    }
  });
  $('#edit-bio-btn').click(function () {
    var bio = $(this).data('bio');
    var bio_link = $(this).data('biolink');
    // alert(bio+bio_link);
    $('#bio-description').val(bio);
    $('#bio-link').val(bio_link);

    $('.alert').addClass('hidden');
  });

  $("input#save-bio-btn").click(function() {
      var user_id = $('#user_id').val();
      var bio = $('#bio-description').val();
      var bio_link = $('#bio-link').val();

      var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
        '(\\#[-a-z\\d_]*)?$','i'); // fragment locator

      // console.log(!!pattern.test(bio_link));
      if (!!pattern.test(bio_link) == true || !bio_link) {
        $.ajax({
          url: "/profile/update",
          method: 'post',
          data: {
             'user_id' : user_id,
             'bio-description': bio,
             'bio-link': bio_link
          },
          success: function(result){
            $('.alert').removeClass('hidden');
            setTimeout(function(){
              $('.link').fadeOut(200, function(){
                  $('.link').text(result).fadeIn().delay(500);
                  $('#editBioModal').modal('hide');
              });
            }, 200);
            $('#bio-link').val(result);
          }
        });
      } else {
        // $(".alert").removeClass('hidden');
        $('#bio-link').addClass('is-invalid');
        $('.ex-bio').css("color", "red");
      }

  });

  $('.heart').click(function(){
      var id = $(this).data('postid');
      var is_fav = $(this);
      console.log($(this));
      $.ajax({
        url: "/post/fav",
        type: "post",
        dataType: 'html',
        data: {
           'post_id': id,

        },
        success: function(result){
          // alert(result);
          // console.log(is_fav);
          if (result == 1) {
            is_fav.addClass("heart-active");
          } else {
            is_fav.removeClass("heart-active");
          }
          location.reload();
        }
      });
  });

  $(".saveToCollection-btn").click(function() {
      var post_id = $(this).data('postid');
      $('#post_id').val(post_id);
  });

  $("#save-btn-tocollection").click(function() {
    var collectid = $( "option:selected" ).data('collectid');
    // alert(collectid);
    var post_id = $('#post_id').val();
    $.ajax({
      url: "/post/addtocollection",
      method: 'post',
      data: {
         'collection_id' : collectid,
         'post_id' : post_id
      },
      success: function(result){
        if (result) {
          $('.alertsave').removeClass('hidden').removeClass('alert-success');
          $('.alertsave').addClass('alert-warning');
          $('.alertsave').text(result);
          setTimeout(function () {
            $('.alertsave').addClass('hidden');
          },3000);
        } else {
          $('.alertsave').removeClass('hidden').removeClass('alert-warning');
          $('.alertsave').addClass('alert-success');
          $('.alertsave').text('Save Success');
          setTimeout(function () {
            $('#saveToCollectionModal').modal('hide');
            $('.alertsave').addClass('hidden');
          },500);
        }
      }
    });
  });

}
