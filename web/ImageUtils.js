window.ImageUtils = {
    /**
     * Convert a color in HSL to RGB.
     * NOTE: red = (0, 1, 0.5)
     *       green = (120, 1, 0.5)
     *       blue = (240, 1, 0.5)
     * @param hue The hue component of the color in degrees [0, 360).
     * @param sat The saturation component of the color in range [0, 1].
     * @param light The lightness component of the color in range [0, 1].
     */
    "hslToRgb" : function(hue, sat, light) {
        var c = (1 - Math.abs((2 * light) - 1)) * sat;
        var h = hue / 60.0;
        var x = c * (1 - Math.abs((h % 2) - 1));
        var m = light - (c / 2.0);
        var result;
        
        if (h >= 0 && h < 1) {
            result = {"R":c + m, "G":x + m, "B":m};
        } else if (h < 2) {
            result = {"R":x + m, "G":c + m, "B":m};
        } else if (h < 3) {
            result = {"R":m, "G":c + m, "B":x + m};
        } else if (h < 4) {
            result = {"R":m, "G":x + m, "B":c + m};
        } else if (h < 5) {
            result = {"R":x + m, "G":m, "B":c + m};
        } else if (h < 6) {
            result = {"R":c + m, "G":m, "B":x + m};
        } else {
            result = {"R":m, "G":m, "B":m};
        }
        
        result.R *= 255.0;
        result.G *= 255.0;
        result.B *= 255.0;
        
        return result;
    },

    /**
     * Convert a color in RGB to HSL.
     * NOTE: red = (255, 0, 0)
     *       green = (0, 255, 0)
     *       blue = (0, 0, 255)
     * @param red The red component of the color in degrees [0, 255].
     * @param green The green component of the color in range [0, 255].
     * @param blue The blue component of the color in range [0, 255].
     * NOTE: hue calculation is broken.
     */
    "rgbToHsl" : function(red, green, blue) {
        var min, max;
        if (red < green && red < blue) {
            min = red;
            max = green < blue ? blue : green;
        } else if (green < red && green < blue) {
            min = green;
            max = red < blue ? blue : red;
        } else {
            min = blue;
            max = red < green ? green : red;
        }
        min /= 255.0;
        max /= 255.0;
        
        var light = (min + max) / 2.0;
        var sat;
        
        if (min == max) {
            sat = 0;
        } else if (light < 0.5) {
            sat = (max - min) / (max + min);
        } else {
            sat = (max - min) / (2.0 - max - min);
        }
        
        var hue;
        if (red > green && red > blue) {
            hue = (green - blue) / (max - min);
        } else if (green > red && green > blue) {
            hue = 2.0 + ((blue - red) / (max - min));
        } else {
            hue = 4.0 + ((red - green) / (max - min));
        }
        
        return {"H" : hue, "S" : sat, "L" : light};
    },
};