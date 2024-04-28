document.addEventListener("DOMContentLoaded", function() {
    const departmentFilter = document.getElementById("department-filter");
    const genderFilter = document.getElementById("gender-filter");
    const sortOrder = document.getElementById("sort-order");
    const prevBtn = document.getElementById("prev-btn");
    const nextBtn = document.getElementById("next-btn");
    const employeeTable = document.getElementById("employee-data");
  
    let currentPage = 1;
    let totalPages = 1;
  
    function fetchEmployees() {
      const url = `https://dbioz2ek0e.execute-api.ap-south-1.amazonaws.com/mockapi/get-employees?page=${currentPage}&limit=10`;
  
      // Check for filters
      const filters = [];
      if (departmentFilter.value) filters.push(`filterBy=department&filterValue=${departmentFilter.value}`);
      if (genderFilter.value) filters.push(`filterBy=gender&filterValue=${genderFilter.value}`);
      if (sortOrder.value) filters.push(`sort=salary&order=${sortOrder.value}`);
  
      if (filters.length > 0) {
        url += `&${filters.join("&")}`;
      }
  
      fetch(url)
        .then(response => response.json())
        .then(data => {
          totalPages = Math.ceil(data.total / 10);
          renderEmployees(data.employees);
        })
        .catch(error => console.error("Error fetching employees:", error));
    }
  
    function renderEmployees(employees) {
      employeeTable.innerHTML = "";
  
      employees.forEach((employee, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${(currentPage - 1) * 10 + index + 1}</td>
          <td>${employee.name}</td>
          <td>${employee.gender}</td>
          <td>${employee.department}</td>
          <td>${employee.salary}</td>
        `;
        employeeTable.appendChild(row);
      });
  
      updatePaginationButtons();
    }
  
    function updatePaginationButtons() {
      prevBtn.disabled = currentPage === 1;
      nextBtn.disabled = currentPage === totalPages;
    }
  
    prevBtn.addEventListener("click", () => {
      if (currentPage > 1) {
        currentPage--;
        fetchEmployees();
      }
    });
  
    nextBtn.addEventListener("click", () => {
      if (currentPage < totalPages) {
        currentPage++;
        fetchEmployees();
      }
    });
  
    departmentFilter.addEventListener("change", () => {
      currentPage = 1; // Reset page when filter changes
      fetchEmployees();
    });
    genderFilter.addEventListener("change", () => {
      currentPage = 1; // Reset page when filter changes
      fetchEmployees();
    });
    sortOrder.addEventListener("change", fetchEmployees);
  
    // Initial fetch on page load
    fetchEmployees();
  });
  
