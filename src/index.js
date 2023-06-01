import "./styles.css";

const urls = [
  "https://statfin.stat.fi/PxWeb/sq/4e244893-7761-4c4f-8e55-7a8d41d86eff",
  "https://statfin.stat.fi/PxWeb/sq/5e288b40-f8c8-4f1e-b3b0-61b86ce5c065"
];
const populationData = fetch(urls[0]).then((res) => res.json());
const employmentData = fetch(urls[1]).then((res) => res.json());

Promise.all([populationData, employmentData]).then((values) => {
  buildTable(values[0], values[1]);
});

const table = document.querySelector("tbody");

function buildTable(populationData, employmentData) {
  const municipalities = parseData(populationData, employmentData);
  municipalities.forEach((municipality) => {
    table.innerHTML += `
      <tr class="${
        municipality.employmentPercentage >= 45
          ? "positive"
          : municipality.employmentPercentage <= 25
          ? "negative"
          : ""
      }">
      <td>${municipality.name}</td>
      <td>${municipality.population}</td>
      <td>${municipality.employment}</td>
      <td>${municipality.employmentPercentage}%</td>
      </tr>
    `;
  });
}

function parseData(populationData, employmentData) {
  const municipalities = [];

  for (const municipality in populationData.dataset.dimension.Alue.category
    .label) {
    const newMunicipality = {
      id: municipality,
      name: populationData.dataset.dimension.Alue.category.label[municipality],
      population:
        populationData.dataset.value[
          populationData.dataset.dimension.Alue.category.index[municipality]
        ],
      employment:
        employmentData.dataset.value[
          employmentData.dataset.dimension["Työpaikan alue"].category.index[
            municipality
          ]
        ]
    };
    newMunicipality.employmentPercentage = (
      (newMunicipality.employment / newMunicipality.population) *
      100
    ).toFixed(2);

    municipalities.push(newMunicipality);
  }

  return municipalities;
}
