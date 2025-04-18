const dropzone = document.getElementById("dropzone");
const fileInput = document.getElementById("fileInput");
const fileList = document.getElementById("fileList");
const zipButton = document.getElementById("zipButton");
const unzipInput = document.getElementById("unzipInput");
const unzippedList = document.getElementById("unzippedList");
const langSelect = document.getElementById("langSelect");

let selectedFiles = [];

const translations = {
  en: {
    title: "FastZip",
    subtitle: "Quickly compress and extract files directly from your browser",
    uploadTitle: "Upload your files",
    unzipTitle: "Unzip a file",
    dropzone: "Drop files here or click to upload",
    createZip: "Create ZIP"
  },
  it: {
    title: "FastZip",
    subtitle: "Comprimi ed estrai file direttamente dal browser",
    uploadTitle: "Carica i tuoi file",
    unzipTitle: "Estrai un file ZIP",
    dropzone: "Trascina qui i file o clicca per caricare",
    createZip: "Crea ZIP"
  }
};

function updateLanguage(lang) {
  document.getElementById("title").textContent = translations[lang].title;
  document.getElementById("subtitle").textContent = translations[lang].subtitle;
  document.getElementById("uploadTitle").textContent = translations[lang].uploadTitle;
  document.getElementById("unzipTitle").textContent = translations[lang].unzipTitle;
  dropzone.textContent = translations[lang].dropzone;
  zipButton.textContent = translations[lang].createZip;
}

langSelect.addEventListener("change", (e) => {
  updateLanguage(e.target.value);
});

updateLanguage(langSelect.value);

dropzone.addEventListener("click", () => fileInput.click());

fileInput.addEventListener("change", (e) => {
  selectedFiles = Array.from(e.target.files);
  renderFileList();
});

dropzone.addEventListener("dragover", (e) => {
  e.preventDefault();
  dropzone.classList.add("dragover");
});

dropzone.addEventListener("dragleave", () => {
  dropzone.classList.remove("dragover");
});

dropzone.addEventListener("drop", (e) => {
  e.preventDefault();
  dropzone.classList.remove("dragover");
  selectedFiles = Array.from(e.dataTransfer.files);
  renderFileList();
});

function renderFileList() {
  fileList.innerHTML = "";
  selectedFiles.forEach(file => {
    const li = document.createElement("li");
    li.textContent = file.name;
    fileList.appendChild(li);
  });
}

zipButton.addEventListener("click", () => {
  if (!selectedFiles.length) return;
  const zip = new JSZip();

  selectedFiles.forEach(file => {
    zip.file(file.name, file);
  });

  zip.generateAsync({ type: "blob" }).then(content => {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(content);
    a.download = "archive.zip";
    a.click();
  });
});

unzipInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;

  JSZip.loadAsync(file).then(zip => {
    unzippedList.innerHTML = "";
    Object.keys(zip.files).forEach(filename => {
      zip.files[filename].async("blob").then(content => {
        const a = document.createElement("a");
        a.href = URL.createObjectURL(content);
        a.download = filename;
        a.textContent = `Download ${filename}`;
        const li = document.createElement("li");
        li.appendChild(a);
        unzippedList.appendChild(li);
      });
    });
  });
});