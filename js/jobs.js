// DOM Elements
const jobList = document.querySelector("#job-list");
const loadingContainer = document.querySelector("#loadingContainer");
const errorContainer = document.querySelector("#errorContainer");

const searchInput = document.querySelector("#searchInput");
const companyFilter = document.querySelector("#companyFilter");
const locationFilter = document.querySelector("#locationFilter");

const prevBtn = document.querySelector("#prevBtn");
const nextBtn = document.querySelector("#nextBtn");
const pageNumber = document.querySelector("#pageNumber");

const themeBtn = document.querySelector("#themeBtn");

 
// Data
let allJobs = [];
let filteredJobs = [];

let currentPage = 1;
const jobsPerPage = 6;

// ================= DARK MODE =================

if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
}

themeBtn.addEventListener("click", () => {

    document.body.classList.toggle("dark");

    localStorage.setItem(
        "theme",
        document.body.classList.contains("dark")
            ? "dark"
            : "light"
    );

});

// ================= FETCH JOBS =================

async function fetchJobs() {

    try {

        loadingContainer.style.display = "grid";
        errorContainer.innerHTML = "";

        const response = await fetch(
            "https://api.joinrise.io/api/v1/jobs/public?page=1&limit=50"
        );

        if (!response.ok) {
            throw new Error("Failed to fetch jobs");
        }

        const data = await response.json();

        allJobs = data.result.jobs;
        filteredJobs = [...allJobs];

        loadingContainer.style.display = "none";

        populateFilters();
        renderJobs();

    }
    catch (error) {

        loadingContainer.style.display = "none";

        errorContainer.innerHTML =
            "<h2>Failed to load jobs.</h2>";

        console.error(error);

    }

}

// ================= RENDER JOBS =================

function renderJobs() {

    jobList.innerHTML = "";

    let start = (currentPage - 1) * jobsPerPage;
    let end = start + jobsPerPage;

    let pageJobs = filteredJobs.slice(start, end);

    pageJobs.forEach(job => {

        jobList.innerHTML += `

        <div class="card">

            <img
                src="${job.owner?.photo || "./images/OIP.webp"}"
                alt="Company Logo"
                onerror="this.src='./images/OIP.webp'"
            >

            <h2>${job.title}</h2>

          <p class="info">
    <img src="./images/company.png" class="icon">
    ${job.owner?.companyName || "Unknown"}
</p>

<p class="info">
    <img src="./images/location.png" class="icon">
    ${job.locationAddress || "Remote"}
</p>

<p class="info">
    <img src="./images/job-type.png" class="icon">
    ${job.type || "Full Time"}
</p>

            <button
                onclick="window.open('${job.url}','_blank')"
            >
                Apply Now
            </button>

        </div>

        `;
    });

    pageNumber.textContent = currentPage;

}

// ================= FILTER DROPDOWNS =================

function populateFilters() {

    companyFilter.innerHTML =
        `<option value="">All Companies</option>`;

    locationFilter.innerHTML =
        `<option value="">All Locations</option>`;

    const companies = [
        ...new Set(
            allJobs
                .map(job => job.owner?.companyName)
                .filter(Boolean)
        )
    ];

    const locations = [
        ...new Set(
            allJobs
                .map(job => job.locationAddress)
                .filter(Boolean)
        )
    ];

    companies.forEach(company => {

        companyFilter.innerHTML += `
            <option value="${company}">
                ${company}
            </option>
        `;

    });

    locations.forEach(location => {

        locationFilter.innerHTML += `
            <option value="${location}">
                ${location}
            </option>
        `;

    });

}

// ================= SEARCH + FILTERS =================

function applyFilters() {

    currentPage = 1;

    const searchValue =
        searchInput.value.toLowerCase();

    const companyValue =
        companyFilter.value;

    const locationValue =
        locationFilter.value;

    filteredJobs = allJobs.filter(job => {

        const titleMatch =

            job.title
                .toLowerCase()
                .includes(searchValue)

            ||

            job.owner?.companyName
                ?.toLowerCase()
                .includes(searchValue);

        const companyMatch =

            companyValue === ""

            ||

            job.owner?.companyName === companyValue;

        const locationMatch =

            locationValue === ""

            ||

            job.locationAddress === locationValue;

        return (
            titleMatch &&
            companyMatch &&
            locationMatch
        );

    });

    renderJobs();

}

// ================= EVENT LISTENERS =================

searchInput.addEventListener(
    "input",
    applyFilters
);

companyFilter.addEventListener(
    "change",
    applyFilters
);

locationFilter.addEventListener(
    "change",
    applyFilters
);

// ================= PAGINATION =================

nextBtn.addEventListener("click", () => {

    let totalPages =
        Math.ceil(
            filteredJobs.length / jobsPerPage
        );

    if (currentPage < totalPages) {

        currentPage++;

        renderJobs();

    }

});

prevBtn.addEventListener("click", () => {

    if (currentPage > 1) {

        currentPage--;

        renderJobs();

    }

});


// ================= START =================

fetchJobs();


  