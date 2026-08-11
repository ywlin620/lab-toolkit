const openBufferButton = document.getElementById("open-buffer");
const bufferSection = document.getElementById("buffer-section");

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


// Open Buffer Preparation
openBufferButton.addEventListener("click", function () {
    bufferSection.classList.remove("hidden");
});


// Step sections
const step1 = document.getElementById("step-1");
const step2 = document.getElementById("step-2");
const step3 = document.getElementById("step-3");


// Buttons
const step1Next = document.getElementById("step1-next");
const step2Back = document.getElementById("step2-back");
const step2Next = document.getElementById("step2-next");
const step3Back = document.getElementById("step3-back");


// Step 2 container
const concentrationInputs =
    document.getElementById("concentration-inputs");


// Step 1 → Step 2
step1Next.addEventListener("click", function () {

    const checkedReagents =
        document.querySelectorAll(
            'input[name="reagent"]:checked'
        );

    if (checkedReagents.length === 0) {
        alert("Please select at least one component.");
        return;
    }

    concentrationInputs.innerHTML = "";

    for (const checkbox of checkedReagents) {

        const reagentName = checkbox.value;
        const reagent = reagents[reagentName];

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
                    >
                    ${reagent.finalUnit}
                </label>

            </div>
        `;
    }

    step1.classList.add("hidden");
    step2.classList.remove("hidden");
});


// Step 2 → Step 1
step2Back.addEventListener("click", function () {

    step2.classList.add("hidden");
    step1.classList.remove("hidden");

});


// Step 2 → Step 3
step2Next.addEventListener("click", function () {

    const concentrationFields =
        document.querySelectorAll(".final-concentration");

    for (const field of concentrationFields) {

        if (field.value === "" || Number(field.value) <= 0) {
            alert("Please enter all final concentrations.");
            return;
        }
    }

    step2.classList.add("hidden");
    step3.classList.remove("hidden");

});


// Step 3 → Step 2
step3Back.addEventListener("click", function () {

    step3.classList.add("hidden");
    step2.classList.remove("hidden");

});

const calculateButton = document.getElementById("calculate-buffer");
const finalVolumeInput = document.getElementById("final-volume");
const bufferResult = document.getElementById("buffer-result");

calculateButton.addEventListener("click", function () {

    const finalVolume = Number(finalVolumeInput.value);

    if (finalVolume <= 0) {
        alert("Please enter a valid final volume.");
        return;
    }

    const concentrationFields =
        document.querySelectorAll(".final-concentration");

    let resultHTML = "<h3>Preparation</h3>";

    let totalAddedVolume = 0;

    for (const field of concentrationFields) {

        const reagentName = field.dataset.reagent;
        const finalConcentration = Number(field.value);

        const reagent = reagents[reagentName];

        let stockVolume = 0;

        if (
            reagent.stockUnit === "M" &&
            reagent.finalUnit === "mM"
        ) {
            stockVolume =
                (finalConcentration / 1000) *
                finalVolume /
                reagent.stock;
        }

        else if (
            reagent.stockUnit === "%" &&
            reagent.finalUnit === "%"
        ) {
            stockVolume =
                finalConcentration *
                finalVolume /
                reagent.stock;
        }

        totalAddedVolume += stockVolume;

        resultHTML += `
            <p>
                <strong>${reagentName}</strong>:
                ${stockVolume.toFixed(2)} mL
            </p>
        `;
    }

    const waterVolume =
        finalVolume - totalAddedVolume;

    resultHTML += `
        <hr>

        <p>
            <strong>ddH₂O:</strong>
            ${waterVolume.toFixed(2)} mL
        </p>

        <p>
            <strong>Final volume:</strong>
            ${finalVolume.toFixed(2)} mL
        </p>
    `;

    bufferResult.innerHTML = resultHTML;
});