#include "ofApp.h"
#include <cmath>

//--------------------------------------------------------------
void ofApp::setup(){

    shader.load("customShader/shader");

    //img.allocate(1440, 1080, OF_IMAGE_GRAYSCALE);
    //plane.set(3024, 1964, 3024, 1964);
    plane.set(ofGetWidth(), ofGetHeight());
    //plane.mapTexCoordsFromTexture(img.getTexture());
    ofSetLogLevel("ofFbo", OF_LOG_VERBOSE);
    
    ofEnableAntiAliasing();
    ofEnableSmoothing();
}

//--------------------------------------------------------------
void ofApp::update(){
    float noiseScale = ofMap(24, 0, ofGetWidth(), 0, 0.1);
    float noiseVel = ofGetElapsedTimef() / 100;

    ofPixels & pixels = img.getPixels();
    int w = img.getWidth();
    int h = img.getHeight();
    //img.update();
}


//--------------------------------------------------------------
void ofApp::draw(){

    // bind our texture. in our shader this will now be tex0 by default
    // so we can just go ahead and access it there.
    //img.getTexture().bind();

    shader.begin();

    ofPushMatrix();

    // translate plane into center screen.
    float tx = ofGetWidth() / 2;
    float ty = ofGetHeight() / 2;
    ofTranslate(tx, ty);

    // the mouse/touch Y position changes the rotation of the plane.
    float mouse_reduction = 5;
    float percentY = mouseY / (float)ofGetHeight() / mouse_reduction - (0.5 / mouse_reduction);
    float percentX = mouseX / (float)ofGetWidth() / mouse_reduction - (0.5 / mouse_reduction);
    
    //float noiseScale = ofMap(24, 0, 360, 0, 0.1);
    rot_deg = fmod(ofGetElapsedTimef() / 20, 360);
    shader.setUniform1i("windowWidth", ofGetWidth());
    shader.setUniform1i("windowHeight", ofGetHeight());
    shader.setUniform1f("pct_y_offset", -percentY);
    shader.setUniform1f("pct_x_offset", percentX);
    shader.setUniform1f("theta", rot_deg);
    //float rotation = ofMap(percentY, 0, 1, -60, 60, true) + 60;
    //ofRotateDeg(rotation, 1, 0, 0);

    //plane.drawWireframe();
    plane.drawFaces();
    
    ofPopMatrix();

    shader.end();
    //img.draw(0, 0);

    ofSetColor(ofColor::white);
}

//--------------------------------------------------------------
void ofApp::keyPressed(int key){
    float rot_deg_frozen = rot_deg;
    shader.setUniform1f("theta", rot_deg_frozen);
}

//--------------------------------------------------------------
void ofApp::keyReleased(int key){

}

//--------------------------------------------------------------
void ofApp::mouseMoved(int x, int y){

}

//--------------------------------------------------------------
void ofApp::mouseDragged(int x, int y, int button){

}

//--------------------------------------------------------------
void ofApp::mousePressed(int x, int y, int button){

}

//--------------------------------------------------------------
void ofApp::mouseReleased(int x, int y, int button){

}

//--------------------------------------------------------------
void ofApp::windowResized(int w, int h){

}

//--------------------------------------------------------------
void ofApp::gotMessage(ofMessage msg){

}

//--------------------------------------------------------------
void ofApp::dragEvent(ofDragInfo dragInfo){

}
