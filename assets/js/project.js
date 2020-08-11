jQuery(document).ready(function($) {

  // Spinner for long-loading content, just in case.
  var $loading = $('#spinner')
  var $content = $('#card-content').hide();
  var $youchose = $('#wrapper-results').hide();
  $(document)
    .ajaxStop(function () {
      $loading.hide();
      $content.show();
      $youchose.show();
    });

  // Use these variables outside of the ajax call
  var userSelections = [];
  var result = [];

  $.get( '../../datasets/customize.csv', function( data ) {
    result = $.csv.toObjects(data);
    console.log(result);

    var years = ["year-1", "year-2", "year-3", "year-4"];
    $.each (years, function(i, deckContainer) {

      $.each( result, function(key,value){
        // Check to see if this card needs to be built. Skip and iterate if not.
        if (value[deckContainer] == "TRUE") {

          // Builds <li> items based on values of the program
          var lines = "";
          var linevalues = {
            "Leadership": "fa-chalkboard-teacher",
            "Research": "fa-flask",
            "Entrepreneurship": "fa-briefcase",
            "Public Speaking":"fa-keynote",
            "Teamwork":"fa-users",
            "Mentoring":"fa-user-friends",
            "Competitive Teams":"fa-chess",
            "Global Engagement":"fa-globe",
            "Advanced Degree":"fa-diploma",
            "K12 Outreach":"fa-bell-school",
            "Professional Certification":"fa-file-certificate"
          }

          for (var line in linevalues) {
            if (value[line] == "TRUE") {
              lines = lines + "<li><span class='fa-li fas " + linevalues[line] + "'></span>" + line + "</li>";
            }
          }

          // console.log(lines);

          // Builds a string which will modify the default card wrapper. Enables filtering by class.
          var cardfilters = ["online","faculty-led","networking","certfication","staff-contact"];
          var filterString = "";

          $.each( cardfilters, function(index,cssClass) {
            if (value[cssClass] == "TRUE") {
              filterString = filterString + cssClass + " ";
            }
          });

          // console.log(filterString);

          // Build the card
          var formID = deckContainer + "-" + value.slug;
          var card =
            '<div class="card card-sm ' + filterString + '">' +
            '<img class="card-img-top" src="https://picsum.photos/450/800?random" alt="Alt Text for Image"/>' +
            '<div class="card-header"><h3 class="card-title">' + value.program + '</h3></div>' +
            '<div class="card-body">' +
              '<p class="card-text">' + value.description + '</p>' +
              '<p class="card-text"><a href=' + value.link + '>Read More</a></p>' +
            '</div>' +
            '<div class="card-footer"><ul class="uds-list fa-ul">' + lines + '</ul>' +
            '<form class="card-checkmark" data-year="' + deckContainer + '" data-slug="' + value.slug + '">' +
            '<input class="sr-only sr-only-focusable" type="checkbox" name="' + formID + '">' +
            '<label class="unselected" for="' + formID + '"><span class="far fa-circle"></span></label>' +
            '<label class="selected" for="' + formID + '"><span class="far fa-check-circle"></span></label>' +
            '</form></div></div><!-- .card -->';

          $('.' + deckContainer + ' .deck').append(card);

        } // end if/then conditional

      }); // end each statement.

      // initialize the carousel for the card deck that was just built.
      $('.' + deckContainer + ' .deck').slick({
        dots: true,
        slidesToShow: 3,
        slidesToScroll: 3,
        responsive: [
          {
            breakpoint: 990,
            settings: {
              dots: true,
              slidesToShow: 2,
              slidesToScroll: 1,
              centerMode: true
            }
          },
          {
            breakpoint: 768,
            settings: {
              dots: true,
              slidesToShow: 1,
              slidesToScroll: 1,
              centerMode: true
            }
          }
        ]
      });

      $('.' + deckContainer + ' button.btn-next').click(function() {
        $('.' + deckContainer + ' .deck').slick('slickNext');
      });

      $('.' + deckContainer + ' button.btn-prev').click(function() {
        $('.' + deckContainer + ' .deck').slick('slickPrev');
      });

    });

    var currentSelect = {};

    // Bind click events to labels for checkboxes. Clicking the actual checkbox will have the same effect.
    $('.card-checkmark label.unselected').click(function() {
      $(this).siblings('input[type=checkbox]').prop('checked', true);
      $(this).parents('.card').addClass('card-selected');
      var curYear = $(this).parent('form').data('year');
      var curSlug = $(this).parent('form').data('slug');
      currentSelect = {
        year: curYear,
        slug: curSlug
      }
      userSelections.push(currentSelect);
    });

    $('.card-checkmark label.selected').click(function() {
      $(this).siblings('input[type=checkbox]').prop('checked', false);
      $(this).parents('.card').removeClass('card-selected');

      var curYear = $(this).parent('form').data('year');
      var curSlug = $(this).parent('form').data('slug');

      for (var i = userSelections.length - 1; i >= 0; --i) {
        if ((userSelections[i].year == curYear) && (userSelections[i].slug == curSlug)) {
          userSelections.splice(i,1);
        }
      }
    });

    $('.card-checkmark label').click(function() {
      var list = $('#results .result-list');
      list.empty();

      // Sort the user selections by year
      userSelections.sort((a, b) => a.year.localeCompare(b.year));

      $.each( userSelections, function(key,pick){

        var item = $.grep(result, function(n) {
          return (n.slug==pick.slug)
        })

        list.append('<li>' + pick.year + ': ' + item[0].slug + ' ' + item[0].link + '</li>');
      });

    });

  }); // end ajax call

  // Progress bar monitoring
  $(window).on('scroll', function() {
    var winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    var height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    var scrolled = (winScroll / height) * 100;
    $('#progress-bar .progress-bar').width(scrolled + '%');
  });

  // Example email from Mailjet API

  var MJ_SMTP_NAME='3cb52c2d8c30f57c82f8826400cdcf76'
  var MJ_SMTP_PASS='7f5c774e2b1f2e32d13dbb2f0f3a8ef0'


  function customizeSendEmail() {
    var recipient = $('#sendbackEmail').val();
    //var emailbody = 'Here are the things you clicked on: ' + $('#results .result-list').text();
    var emailbody = '<!doctype html><html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office"><head><title>Your Customized Experience</title><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style type="text/css">#outlook a{padding:0;}body{margin:0;padding:0;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;}table, td{border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;}img{border:0;height:auto;line-height:100%; outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;}p{display:block;margin:13px 0;}</style><!--[if mso]> <xml> <o:OfficeDocumentSettings> <o:AllowPNG/> <o:PixelsPerInch>96</o:PixelsPerInch> </o:OfficeDocumentSettings> </xml><![endif]--><!--[if lte mso 11]> <style type="text/css"> .mj-outlook-group-fix{width:100% !important;}</style><![endif]--><style type="text/css">@media only screen and (min-width:480px){.mj-column-per-100{width:100% !important; max-width: 100%;}}</style><style type="text/css">@media only screen and (max-width:480px){table.mj-full-width-mobile{width: 100% !important;}td.mj-full-width-mobile{width: auto !important;}}</style></head><body style="background-color:#e8e8e8;"><div style="display:none;font-size:1px;color:#ffffff;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">Here are your selections from the Customize website.</div><div style="background-color:#e8e8e8;"><table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#191919;background-color:#191919;width:100%;"><tbody><tr><td><div style="margin:0px auto;max-width:600px;"><table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;"><tbody><tr><td style="direction:ltr;font-size:0px;padding:20px 0;padding-bottom:0;text-align:center;"><div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;"><table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%"><tr><td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;"><table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;border-spacing:0px;"><tbody><tr><td style="width:350px;"><img alt="" height="auto" src="http://dev-customize-static.pantheonsite.io/assets/img/endorsed-logo/asu_fultonengineering_horiz_rgb_white_150ppi.png" style="border:0;display:block;outline:none;text-decoration:none;height:auto;width:100%;font-size:13px;" width="350"></td></tr></tbody></table></td></tr><tr><td align="center" style="font-size:0px;padding:0;word-break:break-word;"><table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;border-spacing:0px;"><tbody><tr><td style="width:600px;"><a href="https://google.com" target="_blank"><img alt="" height="auto" src="https://customize.engineering.asu.edu/wp-content/uploads/2016/01/STI-bridge-build_8429_a.jpg" style="border:0;display:block;outline:none;text-decoration:none;height:auto;width:100%;font-size:13px;" width="600"></a></td></tr></tbody></table></td></tr></table></div></td></tr></tbody></table></div></td></tr></tbody></table><!-- <mj-section background-color="#e8e8e8" padding-top="0" padding-bottom="0"> <mj-column width="100%"> <mj-image src="https://res.cloudinary.com/dheck1ubc/image/upload/v1544156968/Email/Images/AnnouncementOffset/header-bottom.png" width="600px" alt="" padding="0" href="https://google.com"/> </mj-column> </mj-section> --><div class="body-section" style="-webkit-box-shadow: 1px 4px 11px 0px rgba(0, 0, 0, 0.15); -moz-box-shadow: 1px 4px 11px 0px rgba(0, 0, 0, 0.15); box-shadow: 1px 4px 11px 0px rgba(0, 0, 0, 0.15); margin: 0px auto; max-width: 600px;"><table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;"><tbody><tr><td style="direction:ltr;font-size:0px;padding:20px 0;padding-bottom:0;padding-top:0;text-align:center;"><div style="background:#ffffff;background-color:#ffffff;margin:0px auto;max-width:600px;"><table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#ffffff;background-color:#ffffff;width:100%;"><tbody><tr><td style="direction:ltr;font-size:0px;padding:20px 0;padding-left:15px;padding-right:15px;text-align:center;"><div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;"><table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%"><tr><td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;"><div style="font-family:Arial, sans-serif;font-size:20px;font-weight:bold;line-height:24px;text-align:left;color:#212b35;">Your experience, customized.</div></td></tr><tr><td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;"><div style="font-family:Arial, sans-serif;font-size:16px;font-weight:400;line-height:24px;text-align:left;color:#637381;">Hi First Last</div></td></tr><tr><td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;"><div style="font-family:Arial, sans-serif;font-size:16px;font-weight:400;line-height:24px;text-align:left;color:#637381;">We believe that you need more than traditional coursework to be competitive and successful in your career. See yourself in these things. Then do them.</div></td></tr><tr><td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;"><div style="font-family:Arial, sans-serif;font-size:16px;font-weight:400;line-height:24px;text-align:left;color:#637381;">Here are your selections from a moment ago:</div></td></tr><tr><td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;"><div style="font-family:Arial, sans-serif;font-size:16px;font-weight:400;line-height:24px;text-align:left;color:#637381;"><ul><li style="padding-bottom: 20px"><strong>Lorem ipsum dolor:</strong> Sit amet consectetur adipisicing elit.</li><li style="padding-bottom: 20px"><strong>Quia a assumenda nulla:</strong> Repudiandae accusamus obcaecati voluptatibus accusantium perspiciatis.</li><li><strong>Tempora culpa porro labore:</strong> In quisquam optio quibusdam fugiat perspiciatis nobis.</li></ul></div></td></tr><tr><td align="left" style="font-size:0px;padding:10px 25px;padding-bottom:30px;word-break:break-word;"><div style="font-family:Arial, sans-serif;font-size:16px;font-weight:400;line-height:24px;text-align:left;color:#637381;">Work it harder, do it faster <a class="text-link" href="https://google.com" style="color: #8c1d40;">makes us stronger</a> hour after. Our work is never over.</div></td></tr></table></div></td></tr></tbody></table></div></td></tr></tbody></table></div><table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;"><tbody><tr><td><div style="margin:0px auto;max-width:600px;"><table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;"><tbody><tr><td style="direction:ltr;font-size:0px;padding:20px 0;text-align:center;"><div style="margin:0px auto;max-width:600px;"><table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;"><tbody><tr><td style="direction:ltr;font-size:0px;padding:20px 0;text-align:center;"><div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;"><table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%"><tbody><tr><td style="vertical-align:top;padding:0;"><table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%"><tr><td align="center" style="font-size:0px;padding:0;word-break:break-word;"><table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="float:none;display:inline-table;"><tr><td style="padding:4px;"><table border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#A1A0A0;border-radius:3px;width:30px;"><tr><td style="font-size:0;height:30px;vertical-align:middle;width:30px;"><a href="https://www.facebook.com/sharer/sharer.php?u=https://www.facebook.com/ASUEngineering" target="_blank"><img height="30" src="https://www.mailjet.com/images/theme/v1/icons/ico-social/facebook.png" style="border-radius:3px;display:block;" width="30"></a></td></tr></table></td></tr></table><table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="float:none;display:inline-table;"><tr><td style="padding:4px;"><table border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#A1A0A0;border-radius:3px;width:30px;"><tr><td style="font-size:0;height:30px;vertical-align:middle;width:30px;"><a href="https://twitter.com/home?status=https://twitter.com/ASUEngineering" target="_blank"><img height="30" src="https://www.mailjet.com/images/theme/v1/icons/ico-social/twitter.png" style="border-radius:3px;display:block;" width="30"></a></td></tr></table></td></tr></table><table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="float:none;display:inline-table;"><tr><td style="padding:4px;"><table border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#A1A0A0;border-radius:3px;width:30px;"><tr><td style="font-size:0;height:30px;vertical-align:middle;width:30px;"><a href="https://www.linkedin.com/shareArticle?mini=true&url=https://www.linkedin.com/edu/ira-a.-fulton-schools-of-engineering-at-arizona-state-university-43093&title=&summary=&source=" target="_blank"><img height="30" src="https://www.mailjet.com/images/theme/v1/icons/ico-social/linkedin.png" style="border-radius:3px;display:block;" width="30"></a></td></tr></table></td></tr></table><table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="float:none;display:inline-table;"><tr><td style="padding:4px;"><table border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#A1A0A0;border-radius:3px;width:30px;"><tr><td style="font-size:0;height:30px;vertical-align:middle;width:30px;"><a href="http://dev-customize-static.pantheonsite.io/#" target="_blank"><img height="30" src="https://www.mailjet.com/images/theme/v1/icons/ico-social/instagram.png" style="border-radius:3px;display:block;" width="30"></a></td></tr></table></td></tr></table></td></tr><tr><td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;"><div style="font-family:Arial, sans-serif;font-size:11px;font-weight:400;line-height:16px;text-align:center;color:#445566;">You are receiving this email because you are awesome and have customized an experience of extra-curricular activities for ASU Engineering.</div></td></tr><tr><td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;"><div style="font-family:Arial, sans-serif;font-size:11px;font-weight:400;line-height:16px;text-align:center;color:#445566;">ASU Ira A. Fulton Schools of Engineering<br>699 S Mill Ave, Tempe, AZ, 85281, USA<br>Copyright © 2020 Arizona Board of Regents</div></td></tr></table></td></tr></tbody></table></div></td></tr></tbody></table></div></td></tr></tbody></table></div></td></tr></tbody></table></div></body></html>'
    // var emailbody = $('<div>');
    // $emailbody.load('../../email-top.html');

    console.log('Recipient: ' + recipient);
    Email.send({
      Host : "in-v3.mailjet.com",
      Username : MJ_SMTP_NAME,
      Password : MJ_SMTP_PASS,
      To : recipient,
      // To : "steve.ryan@asu.edu",
      From : "fultonweb@asu.edu",
      Subject : "Sample email from Customize Website (Development)",
      Body : emailbody
      }).then(
        // message => alert(message)
      );
  }

  $("#sendback").submit(function(e) {
      console.log('Submitting form.');
      customizeSendEmail();
      e.preventDefault();
  });

});


