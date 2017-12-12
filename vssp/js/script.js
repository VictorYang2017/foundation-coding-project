/* All my function code will be in this "Document ready function" */
$(document).ready(function(){
    /* Global scope */
    // Targeting the DOMs in HTML
    var screenOneHTML = $("#screen-one"),
    screenTwoHTML = $("#screen-two"), 
    cityRegionInputHTML = $(".city-region"),
    typeOfAccommodationsDropdownHTML = $(".type-of-accommodations"),
    howManyPeopleDropdownHTML = $(".how-many-people"),
    howManyRoomsDropdownHTML = $(".how-many-rooms"),
    howManyNightsDropdownHTML = $(".how-many-nights"),
    needHelpButtonHTML = $(".header-container--help-button"),
    searchButtonHTML = $(".right-side--search-button"),
    outputDataSectionHTML = $(".output-data-section"),
    outPutDataSectionContainerHTML = $(".output-data-section--container"),
    accommodationImageContainerHTML = $(".bottom-section--accommodation-images"),
    accommodationImageOneHTML = $(".image-one"),
    accommodationImageTwoHTML = $(".image-two"),
    accommodationImageThreeHTML = $(".image-three"),
    accommodationInformationContainerHTML = $(".bottom-section--accommodation-info")
    cityRegionInfoHTML = $(".city-region-info"),
    typeOfAccommodationInfoHTML = $(".type-of-accommodation-info"),
    howManyPeopleInfoHTML = $(".how-many-people-info"),
    howManyNightsInfoHTML = $(".how-many-nights-info"),
    priceInfoHTML = $(".price"),
    breakfastDetailInfoHTML = $(".breakfast-detail-info"),
    dinnerDetailInfoHTML = $(".dinner-detail-info"),
    errorMsgHTML = $(".error-msg");

 

    function init(){
        // Different types of accommodations data
        $.getJSON("json/types-of-accommodations.json", function(typesOfAccommodationsJSONData){
            typesOfAccommodationsArray = typesOfAccommodationsJSONData.typesOfAccommodation;
            displayTypeOfAccommodationsOptions(typesOfAccommodationsArray);
            typeOfAccommodationsDropdownHTML.val("hotel").change();
        });
        // Accommodation lists data
        $.getJSON("json/accommodation-lists.json", function(accommodationListsJSONData){
            accommodationListsArray = accommodationListsJSONData.accommodationLists;
            getTheInputAndDropdownValues(accommodationListsArray);
        });
        // Different accommodation meals data
        $.getJSON("json/accommodation-meals.json", function(accommodationMealsJSONData){
            accommodationMealsArray = accommodationMealsJSONData.accommodationMeals;
        });

        // Dropdown menu on change
        typeOfAccommodationsDropdownHTML.on("change", function(){
             displayHowManyPeopleAndNightsOptions(typesOfAccommodationsArray);
             displayHowManyRoomsOptions(typesOfAccommodationsArray);
        });

        // Input search button on click
        searchButtonHTML.on("click", function(evt){
            evt.preventDefault();
            getTheInputAndDropdownValues(accommodationListsArray);
            $("html, body").animate({
                scrollTop: $(outPutDataSectionContainerHTML).offset().top
            }, 2000);
            return false;

        });
        
        // Input validation
        cityRegionInputHTML.on("blur", function(){
            checkInputValidation();/*<---------- Redo here!!!!!*/
        });



    }



/* Displaying "options" inside the HTML select tag FUNCTION*/
    /**
     * Displaying type of accommodations options inside of type of accommodation "select (HTML)tag"
     * @param  {} typesOfAccommodationsArray
     */
    function displayTypeOfAccommodationsOptions(typesOfAccommodationsArray){
        var typeOfAccommodationsOptionHTMLString = "";
        $.each(typesOfAccommodationsArray, function(i, accommodation){
            typeOfAccommodationsOptionHTMLString += `<option value="${accommodation.slug}">${accommodation.type}</option>`
        });
        typeOfAccommodationsDropdownHTML.html(typeOfAccommodationsOptionHTMLString);
    }

    /**
     * Displaying how many people options and how many nights options inside of how many people "select (HTML)tag" and how many nights "select (HTML)tag"
     * @param  {} typesOfAccommodationsArray
     */
    function displayHowManyPeopleAndNightsOptions(typesOfAccommodationsArray){
        var howManyPeopleOptionHTMLString = "";
        var howManyNightsOptionHTMLString = "";
        $.each(typesOfAccommodationsArray, function(i, accommodation){
            if(typeOfAccommodationsDropdownHTML.val() === accommodation.slug){
                howManyPeopleOptionHTMLString = getOptionsString(accommodation.minOfPeople, accommodation.maxOfPeople, accommodation);
                howManyNightsOptionHTMLString = getOptionsString(accommodation.minOfNights, accommodation.maxOfNight, accommodation);
            }
        });
        howManyPeopleDropdownHTML.html(howManyPeopleOptionHTMLString);
        howManyNightsDropdownHTML.html(howManyNightsOptionHTMLString);
    }

    function getOptionsString(start, end, accommodation){
    var s = "";
     for(var i = start; i <= end; i++){
            s += `<option value="${i}">${i}</option>`;
        }
    return s;
    }

    /**
     * Make how many room options appear and disappear inside of how many rooms "select (HTML) tag"
     * (make the options disappear if the type of accommodation dropdown's menu value is "house" and if is not "house", make the option appear)
     * @param  {} typesOfAccommodationsArray
     */
    function displayHowManyRoomsOptions(typesOfAccommodationsArray){
        var howManyRoomsOptionHTMLString = "";
        if(typeOfAccommodationsDropdownHTML.val() !== "house"){
            for(var i = 1; i <= 5; i++){
                howManyRoomsOptionHTMLString += `<option>${i}</option>`
            }
        }else{
            howManyRoomsOptionHTMLString += `<option>0</option>`
        }
        howManyRoomsDropdownHTML.html(howManyRoomsOptionHTMLString);
    }





/* Getting all the values from the input fields & dropdown menus and display the results */
    /**
     * Getting all the valus in the input section
     * (Getting input field value, type of accommodations value, how many people dropdown menu value, how many nights dropdown menu value)
     * @param  {} accommodationListsArray
     */
    function getTheInputAndDropdownValues(accommodationListsArray){
        var cityRegionInputValue = cityRegionInputHTML.val(),
        typeOfAccommodationsDropdownValue = typeOfAccommodationsDropdownHTML.val(),
        howManyPeopleDropdownValue = howManyPeopleDropdownHTML.val(),
        howManyNightsDropdownValue = howManyNightsDropdownHTML.val();
        var afterFilteredAllTheInputValueArray = [];
        $.each(accommodationListsArray, function(i, individualAccommodation){
            var cityRegionFiltering = cityRegionInputValue === individualAccommodation.region,
            typeOfAccommodationsFiltering = typeOfAccommodationsDropdownValue === individualAccommodation.type,
            howManyPeopleFiltering = (howManyPeopleDropdownValue <= individualAccommodation.maxOfPeople) && (howManyPeopleDropdownValue >= individualAccommodation.minOfPeople),
            howManyNightsFiltering = (howManyNightsDropdownValue <= individualAccommodation.maxOfNights) && (howManyNightsDropdownValue >= individualAccommodation.minOfNights);
            if( cityRegionFiltering && typeOfAccommodationsFiltering && howManyPeopleFiltering && howManyNightsFiltering){
                afterFilteredAllTheInputValueArray.push(individualAccommodation);
            }
        });
        displaySearchResultDatas(afterFilteredAllTheInputValueArray);
    }
    // City and region input validation
    function checkInputValidation(){
        var cityRegionNameArray = ["Christchurch", "Auckland", "Dunedin", "Wellington"];
        var cityAndRegionValue = cityRegionInputHTML.val();
        $.each(cityRegionNameArray, function(i, cityRegionName){
            if(cityAndRegionValue !== cityRegionName){
                errorMsgHTML.css("display", "block");
            }
        });
    }

    /**
     * Displaying the results
     * (displaying the results after the user clicked the search button on the input section)
     * @param  {} afterFilteredAllTheInputValueArray
     */
    function displaySearchResultDatas(afterFilteredAllTheInputValueArray){
        var accommodationString = "";
        $.each(afterFilteredAllTheInputValueArray, function(i, individualFilteredAccommodation){
            accommodationString += `<div data-slug="${individualFilteredAccommodation.slug}" class="individual-data">
                                        <div class="individual-data--image" style="background-image: url(${individualFilteredAccommodation.images[0].url}); background-size:cover; background-position:center center; background-repeat:no-repeat"></div>
                                        <div class="individual-data--info">
                                            <h6 class="individual-data--heading">${individualFilteredAccommodation.name}</h6>
                                            <p>Maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam.</p>
                                            <h6 class="individual-data--price">$${individualFilteredAccommodation.pricePerNight}/Night</h6>
                                        </div>
                                    </div>`
        });
        outPutDataSectionContainerHTML.html(accommodationString);
        accommodationStringDatasHTML = $(".individual-data");
        getSearchResultClickedDatas(accommodationStringDatasHTML);
    }

/* Display screen two(detailed page) including meal information, accommodation informations and accommodation price after the user clicked the search results */
    /**
     * Displaying the accommodation detail page when the user clicked anyone of the accommodation list
     * @param  {} accommodationStringDatasHTML
     */
    function getSearchResultClickedDatas(accommodationStringDatasHTML){
        $.each(accommodationStringDatasHTML, function(i, accommodationStringDataHTML){
            $(this).on("click", function(evt){
                evt.preventDefault();
                var accommodationStringDataSlug = $(this).data("slug");
                var selectedAccommodation = "";
                $.each(accommodationListsArray, function(i, individualAccommodation){
                    if (accommodationStringDataSlug === individualAccommodation.slug){
                        displaySecondScreen(individualAccommodation);
                        displayCalculatedPrice(individualAccommodation);
                    }
                });
                return false;
            });
        });
    }
    // Displaying and hiding the second screen(which is the detail page)
    function displaySecondScreen(individualAccommodation){
        screenOneHTML.hide();
        screenTwoHTML.show();
        displayAccommodationDetailPage(individualAccommodation);
    }
    // Displaying informations on the details pages(accommodation detail informations, images, accommodation info and meals)
    function displayAccommodationDetailPage(individualAccommodation){
        var accommodationDetailPageImageHTML = "",
        accommodationDetailPageInfoHTML = "",
        accommodationDetailPageBreakfastHTML = "",
        accommodationDetailPageDinnerHTML = "";
        accommodationDetailPageImageHTML += `<div class="image-one" style="background-image: url(${individualAccommodation.images[0].url})"></div>
                                                <div class="image-two-and-three">
                                                    <div class="image-two" style="background-image: url(${individualAccommodation.images[1].url})"></div>
                                                    <div class="image-three" style="background-image: url(${individualAccommodation.images[2].url})"></div>
                                                </div>`
        accommodationDetailPageInfoHTML += `<div class="accommodation-info">
                                                <div class="title"><p>City / Region</p></div>
                                                <div class="city-region-info info"><p>${individualAccommodation.region}</p></div>
                                            </div>
                                            <div class="accommodation-info second-accommodation-info">
                                                <div class="title"><p>Type of accommodation</p></div>
                                                <div class="type-of-accommodation-info info"><p style="text-transform: capitalize">${individualAccommodation.type}</p></div>
                                            </div>
                                            <div class="accommodation-info third-accommodation-info">
                                                <div class="title"><p>How many people</p></div>
                                                <div class="how-many-people-info info"><p>${individualAccommodation.minOfPeople} to ${individualAccommodation.maxOfPeople} people</p></div>
                                            </div>
                                            <div class="accommodation-info">
                                                <div class="title"><p>How many nights</p></div>
                                                <div class="how-many-nights-info info">
                                                    <div class="how-many-nights--minimum">Minimum: ${individualAccommodation.minOfNights} night</div>
                                                    <div class="how-many-nights--maximum">Maximum: ${individualAccommodation.maxOfNights} nights</div>
                                                </div>
                                            </div>`
        $.each(accommodationMealsArray, function(i, accommodationMeal){
            if(individualAccommodation.type === accommodationMeal.accommodation){
                accommodationDetailPageBreakfastHTML += `<p>${accommodationMeal.breakfast}</p>`
                accommodationDetailPageDinnerHTML += `<p>${accommodationMeal.dinner}</p>`

            }
        });        
        accommodationImageContainerHTML.html(accommodationDetailPageImageHTML);
        accommodationInformationContainerHTML.html(accommodationDetailPageInfoHTML);
        breakfastDetailInfoHTML.html(accommodationDetailPageBreakfastHTML);
        dinnerDetailInfoHTML.html(accommodationDetailPageDinnerHTML);
    }
    // Calculation the price and displaying it
    function displayCalculatedPrice(individualAccommodation){
        var howManyPeopleDropdownValue = parseInt(howManyPeopleDropdownHTML.val()),
        howManyNightsDropdownValue = parseInt(howManyNightsDropdownHTML.val()),
        howManyRoomsDropdownValue = parseInt(howManyRoomsDropdownHTML.val()),
        accommodationPricePerNight = individualAccommodation.pricePerNight;
        var totalPrice;
        $.each(typesOfAccommodationsArray, function(i, accommodationType){
            if(individualAccommodation.type === accommodationType.slug){
                totalPrice = (accommodationPricePerNight + howManyRoomsDropdownValue) * howManyNightsDropdownValue;
            }else{
                totalPrice = accommodationPricePerNight * howManyRoomsDropdownValue * howManyNightsDropdownValue;
            }
        });
        var totalPriceHTML = `<p>Price: $${totalPrice}NZD</p>`;
    priceInfoHTML.html(totalPriceHTML);
    }



    init();
});