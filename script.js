document.addEventListener('DOMContentLoaded', function() {
    // Get all elements *after* the DOM is fully loaded
    const lightingCondition = document.getElementById('lightingCondition');
    const viewAngle = document.getElementById('viewAngle');
    const mainImage = document.getElementById('mainImage');
    const buildingTypesToggle = document.getElementById('buildingTypesToggle');
    const buildingTypePanel = document.getElementById('buildingTypePanel');
    const buildingTypes = document.querySelectorAll('.building-type');
    const glazingType = document.getElementById('glazingType');
    const lightTransmission = document.getElementById('lightTransmission');
    const uValue = document.getElementById('uValue');
    const solarHeatGain = document.getElementById('solarHeatGain');
    const reflectivity = document.getElementById('reflectivity');
    const glazingDescription = document.getElementById('glazingDescription');
    const comparisonGlazing = document.getElementById('comparisonGlazing');


    // Current state
    let currentBuildingType = 'cultural-center';
    let currentLighting = 'Sunny';
    let currentView = 'Far';
    let currentGlazing = 'Shine';
   

    // Event Listeners
    buildingTypesToggle.addEventListener('click', toggleBuildingTypes);
    buildingTypes.forEach(type => type.addEventListener('click', selectBuildingType));
    lightingCondition.addEventListener('change', updateMainImage);
    viewAngle.addEventListener('change', updateMainImage);
    glazingType.addEventListener('change', updateGlazingSpecs);
    comparisonGlazing.addEventListener('change', updateComparisonImage);


    // Functions
    function toggleBuildingTypes() {
        if (buildingTypePanel.style.display === 'none') {
            buildingTypePanel.style.display = 'grid';
            buildingTypesToggle.querySelector('.toggle-icon').textContent = '▼';
        } else {
            buildingTypePanel.style.display = 'none';
            buildingTypesToggle.querySelector('.toggle-icon').textContent = '▶';
        }
    }

    function selectBuildingType(event) {
        currentBuildingType = event.target.getAttribute('data-type');
        updateMainImage();
        buildingTypes.forEach(t => t.style.border = '1px solid #ddd');
        event.target.style.border = '2px solid #007bff';
    }

    function updateMainImage() {
        const imagePath = `images/${currentBuildingType}-${currentLighting}-${currentView}-${currentGlazing}.png`;
        mainImage.src = imagePath;
        updateComparisonImage();
    }

    function updateGlazingSpecs() {
        const glazingSpecs = {
            'Shine': {
                lightTransmission: '90%',
                uValue: '5.8 W/m²K',
                solarHeatGain: '0.86',
                reflectivity: 'Low',
                description: 'Standard clear glass with high transparency'
            },
            'Stropray': {
                lightTransmission: '50%',
                uValue: '5.7 W/m²K',
                solarHeatGain: '0.50',
                reflectivity: 'Medium',
                description: 'Tinted glass with reduced solar heat gain and glare'
            },
            'Ultraselect': {
                lightTransmission: '30%',
                uValue: '5.6 W/m²K',
                solarHeatGain: '0.35',
                reflectivity: 'High',
                description: 'Reflective coating reduces heat gain and provides privacy'
            },
            'VRE': {
                lightTransmission: '70%',
                uValue: '1.8 W/m²K',
                solarHeatGain: '0.40',
                reflectivity: 'Medium-Low',
                description: 'Low-emissivity coating for improved thermal performance'
            }
        };

        const specs = glazingSpecs[currentGlazing];

        lightTransmission.textContent = specs.lightTransmission;
        uValue.textContent = specs.uValue;
        solarHeatGain.textContent = specs.solarHeatGain;
        reflectivity.textContent = specs.reflectivity;
        glazingDescription.textContent = specs.description;
    }

    function updateComparisonImage() {
        const comparison = comparisonGlazing.value;
        if (comparison === "None") {
            disableComparison();
        } else {
            const comparisonImagePath = `images/${currentBuildingType}-${currentLighting}-${currentView}-${comparison}.png`;
            if ($("#secondImage").length) {
                $("#secondImage").attr("src", comparisonImagePath);
            } else {
                enableComparison(comparisonImagePath, comparison);
            }
        }
    }
    function enableComparison(newImageSrc, comparison) {
        var $container = $(".image-container");
        
        if (!$container.hasClass("twentytwenty-container")) {
            // Append second image if not already present
            if ($container.find("#secondImage").length === 0) {
                $secondImage = $(`<img id="secondImage" src="${newImageSrc}" alt="Comparison Image" style="display: none;">`);
                $container.append($secondImage);
            } else {
                $("#secondImage").attr("src", newImageSrc);
            }
    
            //Initialize TwentyTwenty after the second image is fully loaded
            $("#secondImage").on("load", function () {
                $secondImage.show();
                $container.twentytwenty({
                    default_offset_pct: .5, // How much of the before image is visible when the page loads
                    orientation: 'horizontal', // Orientation of the before and after images ('horizontal' or 'vertical')
                    before_label: currentGlazing, // Set a custom before label
                    after_label: comparison, // Set a custom after label
                    no_overlay: false, //Do not show the overlay with before and after
                    move_slider_on_hover: false, // Move slider on mouse hover?
                    move_with_handle_only: true, // Allow a user to swipe anywhere on the image to control slider movement. 
                    click_to_move: true // Allow a user to click (or tap) anywhere on the image to move the slider to that location.
                  });
            });

            // var $firstImage = $container.find("img:first");
            // var $secondImage = $("#secondImage");

            // $.when($firstImage.load(), $secondImage.load()).then(function() {
            //     $container.twentytwenty();
            // });
        }
    }
    
    
    function disableComparison() {
        var $container = $(".image-container");
    
        // Destroy TwentyTwenty UI elements
        if ($container.hasClass("twentytwenty-container")) {
            $container.find(".twentytwenty-overlay, .twentytwenty-handle").remove(); // Remove UI elements
            $container.off(); // Unbind events
            $container.removeClass("twentytwenty-container"); // Remove class
        }
    
        // Remove the second image
        $("#secondImage").remove();
    }

    // function updateComparisonImage(newImageSrc) {
    //     var $secondImage = $("#secondImage");
    
    //     if ($secondImage.length) {
    //         // Replace only the src attribute to maintain layout & divider position
    //         $secondImage.attr("src", newImageSrc);
    //     }
    // }

    // Initialize
    updateGlazingSpecs();
    updateMainImage();
});
