const reagents = {

    "Tris-HCl": {
        stock: 1,
        stockUnit: "M",
        finalUnit: "mM"
    },

    "NaCl": {
        stock: 5,
        stockUnit: "M",
        finalUnit: "mM"
    },

    "Imidazole": {
        stock: 2,
        stockUnit: "M",
        finalUnit: "mM"
    },

    "Glycerol": {
        stock: 100,
        stockUnit: "%",
        finalUnit: "%"
    },

    "EDTA": {
        stock: 0.5,
        stockUnit: "M",
        finalUnit: "mM"
    }

};


const reagentCheckboxes =
    document.querySelectorAll('input[name="reagent"]');

const concentrationInputs =
    document.getElementById("concentration-inputs");


function updateConcentrationInputs() {

    concentrationInputs.innerHTML = "";

    const checkedReagents =
        document.querySelectorAll(
            'input[name="reagent"]:checked'
        );

    if (checkedReagents.length === 0) {

        concentrationInputs.innerHTML =
            '<p class="placeholder">Select components in Step 1.</p>';

        return;
    }


    for (const checkbox of checkedReagents) {

        const reagentName = checkbox.value;

        const reagent =
            reagents[reagentName];


        concentrationInputs.innerHTML += `

            <div class="concentration-row">

                <strong>${reagentName}</strong>

                <p>
                    Stock:
                    ${reagent.stock}
                    ${reagent.stockUnit}
                </p>

                <label>
                    Final:
                    <input
                        type="number"
                        class="final-concentration"
                        data-reagent="${reagentName}"
                    >

                    ${reagent.finalUnit}

                </label>

            </div>
        `;
    }

}


for (const checkbox of reagentCheckboxes) {

    checkbox.addEventListener(
        "change",
        updateConcentrationInputs
    );

}