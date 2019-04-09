
/************************************************
Basics
************************************************/
function setFocus(theID) {
    document.getElementById(theID).focus();
}
        
function setVisible(ID) {
    var element = document.getElementById(ID);
    element.style.visibility = "visible";
}

function setHidden(ID) {
    var element = document.getElementById(ID);
    element.style.visibility = "hidden";
}

function reseterrors() {
    var array = document.getElementsByClassName("error");
    var i = 0;
    for (; i < array.length; i++) {
        array[i].style.visibility = "hidden";
    }
}

/************************************************
Specific types of fields
************************************************/
function validateText(text, texterror) {
    var data = document.getElementById(text).value;
     
    if (data.length == 0) {
        setVisible(texterror);
        return false;
    }
    else setHidden(texterror);
    return true;
}

function validatePass(pass1, pass2, passErr) {
    var p1 = document.getElementById(pass1).value;
    var p2 = document.getElementById(pass2).value;

    if (p1.length == 0 || p2.length == 0 || p1 != p2) {
        setVisible(passErr);
        return false;
    }
    else setHidden(passErr);
    return true;
}

function validateDropDown(field, fieldError) {
    // for this function to work, value of the default must be none
    if (document.getElementById(field).value == "none") {
        setVisible(fieldError);
        return false;
    }
    setHidden(fieldError);
    return true;
}

/************************************************
validation for each form
************************************************/
function validateCreateGoal() {
    var name = document.getElementById("name").value;
    var freq = document.getElementById("frequency").value;    
    var entry = document.getElementById("entry").value;

    if (entry == "none") {
        setVisible("entryError");
        setFocus("entry");
        return false;
    }

    if (freq == "none") {
        setVisible("frequencyError");
        setFocus("frequency");
        return false;
    }

    if (name.length == 0) {
        setVisible("nameError");
        setFocus("name");
        return false;
    }
    return true;
}
