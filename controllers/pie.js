
function getPiTypes(req, res) {
    const pieResults = [
        {id: 12,  type: "pumpkin"},
        {id: 342, type: "cherry"},
        {id: 4,   type: "pecan"},
        {id: 122, type: "pizza"}
    ];

    res.json(pieResults);
}

function getPi(req, res) {
    const id = req.params.id;
    console.log(`request for pi with id : ${id}`);


    const result = {
        id: id, 
        type: "cherry",
        calories: 150,
        quantity: 3
    };

    res.json(result);
}

function createPie(req, res) {
    console.log("creating a pi");

    const type = req.body.type;
    const quantity = req.body.quantity;
    const calories = req.body.calories;

    console.log(`type: ${type} quan: ${quantity} calories: ${calories}`);

    const result = {
          id:3
        , type: type
        , quantity: quantity
        , calories: calories
    };
    
    res.json(result);
}

module.exports = {
      getPiTypes: getPiTypes
    , getPi: getPi
    , createPi: createPie
};