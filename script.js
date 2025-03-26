document.addEventListener('DOMContentLoaded', function() {
    // Elements
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
    
    // Current state
    let currentBuildingType = 'cultural-center';
    let currentLighting = 'Sunny';
    let currentView = 'Far';
    let currentGlazing = 'Shine';
    
    // Toggle building types panel
    buildingTypesToggle.addEventListener('click', function() {
        if (buildingTypePanel.style.display === 'none') {
            buildingTypePanel.style.display = 'grid';
            buildingTypesToggle.querySelector('.toggle-icon').textContent = '▼';
        } else {
            buildingTypePanel.style.display = 'none';
            buildingTypesToggle.querySelector('.toggle-icon').textContent = '▶';
        }
    });
    
    // Building type selection
    buildingTypes.forEach(type => {
        type.addEventListener('click', function() {
            currentBuildingType = this.getAttribute('data-type');
            updateMainImage();
            
            // Highlight selected building type
            buildingTypes.forEach(t => t.style.border = '1px solid #ddd');
            this.style.border = '2px solid #007bff';
        });
    });
    
    // Lighting condition change
    lightingCondition.addEventListener('change', function() {
        currentLighting = this.value;
        updateMainImage();
    });
    
    // View angle change
    viewAngle.addEventListener('change', function() {
        currentView = this.value;
        updateMainImage();
    });
    
    // Glazing type change
    glazingType.addEventListener('change', function() {
        currentGlazing = this.value;
        updateGlazingSpecs();
        updateMainImage();
    });
    
    // Update the main image based on all selections
    function updateMainImage() {
        // In a real implementation, you would have different images for each combination
        // Here we're just constructing a filename pattern
        // const imagePath = `images/${currentBuildingType}-${currentLighting}-${currentView}-${currentGlazing}.jpg`;
        const imagePath = `images/${currentBuildingType}-${currentLighting}-${currentView}-${currentGlazing}.png`;
        // For demonstration, we'll just log what would happen
        console.log(`Changing image to: ${imagePath}`);
        
        // In reality, you would check if the image exists and handle errors
        // mainImage.src = imagePath;
        
        // For the demo, we'll just use the same image
        // In a real implementation, you would replace this with actual image paths
        mainImage.src = imagePath;
    }
    
    // Update glazing specifications based on selection
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
    
    // Initialize with default values
    updateGlazingSpecs();
    
    // Select the default building type
    const defaultBuildingType = document.querySelector('[data-type="residential-tower"]');
    if (defaultBuildingType) {
        defaultBuildingType.style.border = '2px solid #007bff';
    }
});
