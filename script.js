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
        currentLighting = lightingCondition.value;
        currentView = viewAngle.value;
        currentGlazing = glazingType.value;
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
        updateMainImage()
    }

    function updateComparisonImage() {
        const comparison = comparisonGlazing.value;
        if (comparison === "None") {
            disableComparison();
        } else {
            const comparisonImagePath = `images/${currentBuildingType}-${currentLighting}-${currentView}-${comparison}.png`;
            updateComparison(comparisonImagePath, comparison);
        }
    }
    
    function updateComparison(newImageSrc, comparison) {
        const $container = $(".image-container");
        const $secondImage = $("#secondImage");
    
        if ($container.hasClass("twentytwenty-container")) {
            // twentytwenty is already initialized, just update the image and label
            $secondImage.attr("src", newImageSrc);
            console.log("change label")
            console.log(comparison)
            // $('.twentytwenty-after-label').text(comparison);
            $('.twentytwenty-after-label').attr('data-content', comparison);
            $('.twentytwenty-after-label span').text(comparison);
            // $('.twentytwenty-before-label').text(currentGlazing);
            $('.twentytwenty-before-label').attr('data-content', currentGlazing);
            $('.twentytwenty-before-label span').text(currentGlazing);

        } else {
            // twentytwenty is NOT initialized, initialize it
            enableComparison(newImageSrc, comparison);
        }
    }
    
    function enableComparison(newImageSrc, comparison) {
        let  $container = $(".image-container");
        let $secondImage = $("#secondImage");
    
        if ($secondImage.length === 0) {
            $secondImage = $(`<img id="secondImage" src="${newImageSrc}" alt="Comparison Image" style="display: none;">`);
            $container.append($secondImage);
        } else {
            $secondImage.attr("src", newImageSrc);
        }
    
        $("#secondImage").on("load", function() {
            $secondImage.show();
            if (!$container.hasClass("twentytwenty-container")) {
                $container.twentytwenty({
                    default_offset_pct: 0.5,
                    orientation: 'horizontal',
                    before_label: currentGlazing,
                    after_label: comparison,
                    no_overlay: false,
                    move_slider_on_hover: false,
                    move_with_handle_only: true,
                    click_to_move: true
                });
            }
        });
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
