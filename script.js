(function (){
  const columns = [
    {key: 'name', label: 'Name', sortable: true, filterable: true},
    {key: 'region', label: 'Region', sortable: true, filterable: true},
    {key: 'population', label: 'Population', sortable: true, filterable: false},
    {key: 'area', label: 'Area', sortable: true, filterable: false},
    {key: 'capital', label: 'Capital', sortable: true, filterable: true}
  ]

  const rowsPerPage = 10;
  let currentPage = 1;
  let filteredData = [];

  async function fetchData(){
    try {
      const response = await fetch('https://restcountries.com/v3.1/all');
      const data = await response.json();
      // console.log(data);
      filteredData = data.map(country => ({
        name: country.name.official,
        region: country.region,
        population: country.population,
        area: country.area,
        capital: country.capital?.[0]
      }))
      console.log(filteredData);
    } catch (error) {
      console.error('Error fetching data: ', error);
    }
  }

  fetchData();
})()