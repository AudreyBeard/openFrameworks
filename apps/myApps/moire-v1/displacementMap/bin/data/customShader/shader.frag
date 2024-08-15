// fragment shader

#version 150

out vec4 outputColor;

uniform float pct_x_offset;
uniform float pct_y_offset;
uniform float alpha;
uniform int white_transparent;
uniform float theta;
uniform int windowWidth;
uniform int windowHeight;
const float smoothstep_buffer = 16;

float smootherstep(float edge0, float edge1, float x) {
  // Scale, and clamp x to 0..1 range
  x = clamp((x - edge0) / (edge1 - edge0), 0, 1);

  return x * x * x * (x * (6.0 * x - 15.0) + 10.0);
}

float lerp(float edge_l, float edge_r, float x){
    x = clamp((x - edge_l) / (edge_r - edge_l), 0, 1);
    return x;
}

/*
float clamp(float x, float lowerlimit, float upperlimit) {
    float clamped = x;
    if(x < lowerlimit){
        clamped = lowerlimit;
    }
    else if(x > upperlimit){
        output = upperlimit;
    }
  return output;
}
 */


float poly_function(float val){
    float fifth = -2 * pow(val, 5);
    float fourth = -5 * pow(val, 4);
    float third = 20 * pow(val, 3);
    float second = 20 * pow(val, 2);
    float first = -50 * val;
    return fifth + fourth + third + second + first;
}

float pattern_function(float x_val,
                       float y_val,
                       float theta){
    const float pi = 3.14159;
    const float frequency_base = 16;
    
    // Defining the polynomial
    float x_poly = poly_function(x_val * 2);
    float y_poly = poly_function(y_val * 2);
    
    // Rotating the polynomial
    x_poly = cos(theta) * x_poly - sin(theta) * y_poly;
    y_poly = sin(theta) * x_poly + cos(theta) * y_poly;
    
    // Squaring it for circular shape (plus poly)
    float x_comp = pow(frequency_base * pi * x_val + x_poly, 2);
    float y_comp = pow(frequency_base * pi * y_val + y_poly, 2);
    
    // Oscillation - concentric circles (plus poly)
    float pattern_val = cos(sqrt(x_comp + y_comp)) / 2 + 0.5;
    return pattern_val;
}


vec4 compute_output(float x_val,
                    float y_val,
                    float thresh,
                    float x_offset,
                    float y_offset,
                    float theta){
    float pattern_raw = pattern_function(x_val, y_val, theta);
    float pattern_off = pattern_function(x_val + x_offset, y_val + y_offset, theta);
    
    float luma_raw = smoothstep((thresh - smoothstep_buffer) / 255,
                                (thresh + smoothstep_buffer) / 255,
                                pattern_raw);
    float luma_off = smoothstep((thresh - smoothstep_buffer) / 255,
                                (thresh + smoothstep_buffer) / 255,
                                pattern_off);
    float luma_out = min(luma_raw, luma_off);
    return vec4(luma_out, luma_out, luma_out, 1.0);

}

void main()
{
    // gl_FragCoord contains the window relative coordinate for the fragment.
    // we use gl_FragCoord.x position to control the red color value.
    // we use gl_FragCoord.y position to control the green color value.
    // please note that all r, g, b, a values are between 0 and 1.

    //float windowWidth = 1920.0;
    //float windowHeight = 1080.0;
    float aspect_ratio = windowWidth / windowHeight;
    
    // Using values in [-0.5, 0.5] because it's most interesting part of polynomials
    float x_val = aspect_ratio * (windowWidth / 2 - gl_FragCoord.x) / (windowWidth / 2);
    float y_val = (windowHeight / 2 - gl_FragCoord.y) / (windowHeight / 2);
    
    outputColor = compute_output(x_val, y_val, 134.0, pct_x_offset, pct_y_offset, theta);
}
