window.ImageUtils = {
    /**
     * Convert a color in HSL to RGB.
     * NOTE: red = (0, 1, 0.5)
     *       green = (120, 1, 0.5)
     *       blue = (240, 1, 0.5)
     * @param hue The hue component of the color in degrees [0, 360).
     * @param sat The saturation component of the color in range [0, 1].
     * @param light The lightness component of the color in range [0, 1].
     * @return RGB color object {"R": INT, "G": INT, "B": INT} where components are [0, 255].
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
        
        result.R = Math.round(result.R * 255.0);
        result.G = Math.round(result.G * 255.0);
        result.B = Math.round(result.B * 255.0);
        
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
     * @return RGB color object {"H": FLOAT, "S": FLOAT, "L": FLOAT} where "H" is [0, 360) and "S"
     * "L" are both [0, 1].
     */
    "rgbToHsl" : function(red, green, blue) {
        var min, max;
        var r = red / 255.0;
        var g = green / 255.0;
        var b = blue / 255.0;

        // NOTE: Red needs to take priority over green, hence "<=".
        if (r <= g && r < blue) {
            min = r;
            max = g < b ? b : g;
        } else if (g < r && g < b) {
            min = g;
            max = r < b ? b : r;
        } else {
            min = b;
            max = r < g ? g : r;
        }
        
        var light = (min + max) / 2.0;
        var d = max - min;

        var sat;
        if (min == max) {
            sat = 0.0;
        } else {
            sat = Math.abs(d / (1 - Math.abs((2 * light) - 1)));
        }
        
        var hue;
        if (min == max) {
            hue = 0.0;
        } else if (r >= g && r > b) {
            hue = ((g - b) / d) % 6;
        } else if (g > r && g > b) {
            hue = 2.0 + ((b - r) / d);
        } else {
            hue = 4.0 + ((r - g) / d);
        }
        hue *= 60.0;
        
        if (hue < 0) {
            hue += 360.0;
        }
        
        return {"H" : hue, "S" : sat, "L" : light};
    },
};