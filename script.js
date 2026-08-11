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
        stock: 1,
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
            "<p>Select components in Step 1.</p>";

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
                    Final concentration:

                    <input
                        type="number"
                        class="final-concentration"
                        data-reagent="${reagentName}"
                        min="0"
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


/* ---------- Calculate ---------- */

const calculateButton =
    document.getElementById("calculate-buffer");

const finalVolumeInput =
    document.getElementById("final-volume");

const bufferResult =
    document.getElementById("buffer-result");


calculateButton.addEventListener("click", function () {

    const finalVolume =
        Number(finalVolumeInput.value);


    if (finalVolume <= 0) {

        alert("Please enter a valid final volume.");

        return;
    }


    const concentrationFields =
        document.querySelectorAll(
            ".final-concentration"
        );


    if (concentrationFields.length === 0) {

        alert("Please select at least one component.");

        return;
    }


    let resultHTML = `
        <h3>Preparation instructions</h3>
    `;

    let totalStockVolume = 0;


    for (const field of concentrationFields) {

        const reagentName =
            field.dataset.reagent;

        const finalConcentration =
            Number(field.value);

        const reagent =
            reagents[reagentName];


        if (finalConcentration <= 0) {

            alert(
                `Please enter a final concentration for ${reagentName}.`
            );

            return;
        }


        let stockVolume = 0;


        if (
            reagent.stockUnit === "M" &&
            reagent.finalUnit === "mM"
        ) {

            stockVolume =
                (finalConcentration / 1000)
                * finalVolume
                / reagent.stock;

        }


        else if (
            reagent.stockUnit === "%" &&
            reagent.finalUnit === "%"
        ) {

            stockVolume =
                finalConcentration
                * finalVolume
                / reagent.stock;

        }


        totalStockVolume += stockVolume;


        resultHTML += `

            <p>
                <strong>${reagentName}</strong><br>

                ${reagent.stock}
                ${reagent.stockUnit}
                stock:

                ${stockVolume.toFixed(2)} mL
            </p>
        `;
    }


    const estimatedWater =
        finalVolume - totalStockVolume;


    resultHTML += `

        <hr>

        <p>
            <strong>Estimated ddH₂O:</strong>
            ${estimatedWater.toFixed(2)} mL
        </p>

        <p>
            Bring to a final volume of
            <strong>${finalVolume} mL</strong>
            with ddH₂O.
        </p>
    `;


    bufferResult.innerHTML =
        resultHTML;

});