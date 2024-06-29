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
  let originalData = [];

  async function fetchData(){
    try {
      const response = await fetch('https://restcountries.com/v3.1/all');
      const data = await response.json();
      originalData = data.map(country => ({
        name: country.name.official,
        region: country.region,
        population: country.population,
        area: country.area,
        capital: country.capital?.[0]
      }))
      filteredData = [...originalData];
      createTable();
    } catch (error) {
      console.error('Error fetching data: ', error);
    }
  }

  function createTable() {
    const container = document.getElementById('datatable-container');
    container.innerHTML = '';
    const table = document.createElement('table');
    table.classList.add('table', 'table-striped', 'table-bordered');
    const thead = document.createElement('thead'); //TODO: Making header fixed
    const tbody = document.createElement('tbody');

    const headerRow = document.createElement('tr');
    const filterRow = document.createElement('tr');
    columns.forEach(column => {
      //rendering headers
      const th = document.createElement('th');
      th.textContent = column.label;
      if(column.sortable) {
        th.classList.add('sortable');
        th.addEventListener('click', () => {
          sortTable(column.key);
        })
      }
      const filterTh = document.createElement('th');
      if(column.filterable) {
        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = `Search ${column.label}`;
        input.classList.add('form-control', 'mt-2');
        input.addEventListener('keypress', (e) => {
          if(e.key == 'Enter'){
            filterTable(column.key, e.target.value)
          }
        });
        filterTh.appendChild(input);
      }
      th.dataset.key = column.key;
      headerRow.appendChild(th);
      filterRow.appendChild(filterTh);
      thead.appendChild(headerRow);
      thead.appendChild(filterRow);
    })
    //render rows
    filteredData.slice((currentPage - 1) * rowsPerPage, (currentPage * rowsPerPage)).forEach(row => {
      const tr = document.createElement('tr');
      columns.forEach(column => {
        const td = document.createElement('td');
        td.textContent = row[column?.key];
        td.dataset.label = column.label;
        tr.appendChild(td);
      })
      tbody.append(tr);
    })

    table.appendChild(thead);
    table.appendChild(tbody);
    container.appendChild(table);

    createPagination();
  }

  function filterTable(key, value){
      filteredData = originalData.filter(row => row[key]?.toLowerCase().includes(value.toLowerCase()));
      createTable();
  }

  function sortTable(key){
    //TODO: selection of sortDirection
    let sortDirection = 'asc';
    filteredData.sort((a, b) => {
      if(a[key] < b[key]) return sortDirection === 'asc' ? '-1' : '1';
      else if(a[key] > b[key]) return sortDirection === 'asc' ? '1' : '-1';
      return 0;
    })
    createTable();
  }

  function createPagination() {
    const container = document.getElementById('datatable-container');
    const pagination = document.createElement('div');
    const totalPages = Math.ceil(filteredData.length / rowsPerPage);
    //previous button
    const prevButton = document.createElement('button');
    prevButton.textContent = 'Previous';
    prevButton.classList.add('btn', 'btn-primary', 'mx-2');
    prevButton.disabled = currentPage === 1;
    prevButton.addEventListener('click', () => {
      currentPage--;
      createTable();
    })
    //next button
    const nextButton = document.createElement('button');
    nextButton.textContent = 'Next';
    nextButton.classList.add('btn', 'btn-primary', 'mx-2');
    nextButton.disabled = currentPage === totalPages;
    nextButton.addEventListener('click', () => {
      currentPage++;
      createTable();
    })

    //TODO: creation of numbered page buttons

    pagination.appendChild(prevButton);
    pagination.appendChild(nextButton);
    container.appendChild(pagination);
  }

  fetchData();
})()