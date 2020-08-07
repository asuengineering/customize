jQuery(document).ready(function($) {

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
            "Leadership": "fa-user",
            "Research": "fa-beaker",
            "Entrepreneurship": "fa-airplane",
            "Public Speaking":"fa-user",
            "Teamwork":"fa-user",
            "Mentoring":"fa-user",
            "Competitive Teams":"fa-user",
            "Global Engagement":"fa-user",
            "Advanced Degree":"fa-user",
            "K12 Outreach":"fa-user",
            "Professional Certification":"fa-user"
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
            '<img class="card-img-top" src="https://picsum.photos/300/800?random" alt="Alt Text for Image"/>' +
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

});
