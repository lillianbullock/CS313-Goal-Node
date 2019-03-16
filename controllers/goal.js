
/*function getPiTypes(req, res) {
    const pieResults = [
        {id: 12,  type: "pumpkin"},
        {id: 342, type: "cherry"},
        {id: 4,   type: "pecan"},
        {id: 122, type: "pizza"}
    ];

    res.json(pieResults);
}*/

/*function getPi(req, res) {
    const id = req.params.id;
    console.log(`request for pi with id : ${id}`);


    const result = {
        id: id, 
        type: "cherry",
        calories: 150,
        quantity: 3
    };

    res.json(result);
}*/

function createGoal(req, res) {
    console.log("creating a pi");

    const freq = req.body.frequency;
    const name = req.body.name;
    //const calories = req.body.calories;

    console.log(`name: ${name} freq: ${freq}`);

    const result = {
          id:3
        , name: name
        , frequency:freq
    };
    
    res.json(result);
}

module.exports = {
    createGoal: createGoal
};