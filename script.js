document.addEventListener('DOMContentLoaded', function() {
    // Get all elements *after* the DOM is fully loaded
    const lightingCondition = document.getElementById('lightingCondition');
    const viewAngle = document.getElementById('viewAngle');
    const mainImage = document.getElementById('mainImage');
    const buildingTypesToggle = document.getElementById('buildingTypesToggle');
    const buildingTypePanel = document.getElementById('buildingTypePanel');
    const buildingTypes = document.querySelectorAll('.building-type');
    const glazingType = document.getElementById('glazingType');
    const solarTransmission = document.getElementById('Solar Transmission');
    const solarReflectance = document.getElementById('Solar Reflectance');
    const visibleTransmission = document.getElementById('Visible Transmission');
    const visibleReflectance = document.getElementById('Visible Reflectance');
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
        // **The Problem:**
        // You were trying to get the data-type from `event.target`, which might be the <img> inside the .building-type div, not the div itself.
        // If you click on the image, the target is the image, which doesn't have the data-type attribute.
        // If you click on the space around the image, the target is the div, which does have the data-type.
        // **The Solution:**
        // We need to traverse up the DOM tree to find the .building-type element, regardless of whether the click was on the image or the div.
        
        let buildingTypeElement = event.target;
        // Check if the clicked element is not the building type div itself
        if (!buildingTypeElement.classList.contains('building-type')) {
            // Traverse up to the parent element (which should be the .building-type div)
            buildingTypeElement = buildingTypeElement.closest('.building-type');
        }
        
        // Check if we found the building type element
        if (buildingTypeElement) {
            currentBuildingType = buildingTypeElement.getAttribute('data-type');
            updateMainImage();
            buildingTypes.forEach(t => t.style.border = '1px solid #ddd');
            buildingTypeElement.style.border = '2px solid #007bff';
        } else {
            console.error("Could not find building type element.");
        }
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
        currentGlazing = glazingType.value;
        const glazingSpecs = {
            'Shine': {
                'Solar Transmission': '25%',
                'Solar Reflectance': '38%',
                'Visible Transmission': '53%',
                'Visible Reflectance': '20%',
                description: 'High reflectance with extremely low solar factor'
            
            },
            'Stropray': {
                'Solar Transmission': '27%',
                'Solar Reflectance': '48%',
                'Visible Transmission': '56%',
                'Visible Reflectance': '17%',
                description: 'High performance in solar control for warm regions'
            },
            'Ultraselect': {
                'Solar Transmission': '47%',
                'Solar Reflectance': '52%',
                'Visible Transmission': '70%',
                'Visible Reflectance': '5%',
                description: 'Premium solar control coatings for fully glazed commercial facades'
            },
            'VRE': {
                'Solar Transmission': '25%',
                'Solar Reflectance': '56%',
                'Visible Transmission': '43%',
                'Visible Reflectance': '45%',
                description: 'Outstanding performance and aesthetics'
            }
        };

        const specs = glazingSpecs[currentGlazing];

        solarTransmission.textContent = specs['Solar Transmission'];
        solarReflectance.textContent = specs['Solar Reflectance'];
        visibleReflectance.textContent = specs['Visible Reflectance'];
        visibleTransmission.textContent = specs['Visible Transmission'];
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
