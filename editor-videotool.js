class VideoTool {
  static get toolbox() {
    return {
      title: "Vidéo",
      icon: '<svg width="17" height="15" viewBox="0 0 24 24"><path d="M17 10.5V6c0-1.1-.9-2-2-2H4C2.89 4 2 4.9 2 6v12c0 1.1.89 2 2 2h11c1.1 0 2-.9 2-2v-4.5l5 4.5v-15l-5 4.5z"/></svg>',
    };
  }

  constructor({ data, config }) {
    this.data = data || {};
    this.config = config || {};
    this.wrapper = null;
    this.videoFile = null;
    this.videoObjectURL = null;
  }

  render() {
    this.wrapper = document.createElement("div");
    this.wrapper.classList.add("video-tool-wrapper");
    if (this.data.file) {
      this.showVideo();
    } else {
      this.showUploader();
    }
    return this.wrapper;
  }

  showUploader() {
    this.wrapper.innerHTML = "";
    const uploadContainer = document.createElement("div");
    uploadContainer.classList.add("video-upload-container");
    uploadContainer.style.cssText = `
      border: 2px dashed #007cba;
      border-radius: 12px;
      padding: 30px;
      text-align: center;
      background: #f8f9fa;
      cursor: pointer;
      min-height: 120px;
    `;

    const input = document.createElement("input");
    input.type = "file";
    input.accept = "video/*";
    input.style.display = "none";

    const label = document.createElement("p");
    label.textContent = "Cliquez ou déposez une vidéo ici";

    const loader = document.createElement("div");
    loader.style.display = "none";
    loader.textContent = "Chargement...";

    uploadContainer.appendChild(label);
    uploadContainer.appendChild(loader);
    uploadContainer.appendChild(input);
    this.wrapper.appendChild(uploadContainer);

    uploadContainer.addEventListener("click", () => input.click());

    input.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (file && file.type.startsWith("video/")) {
        this.handleFile(file, loader);
      }
    });

    uploadContainer.addEventListener("dragover", (e) => {
      e.preventDefault();
      uploadContainer.style.backgroundColor = "#e3f2fd";
    });

    uploadContainer.addEventListener("dragleave", () => {
      uploadContainer.style.backgroundColor = "#f8f9fa";
    });

    uploadContainer.addEventListener("drop", (e) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith("video/")) {
        this.handleFile(file, loader);
      }
    });
  }

  handleFile(file, loader) {
    const maxSize = 100 * 1024 * 1024;
    if (file.size > maxSize) {
      this.showError("La taille maximale est de 100 Mo");
      return;
    }

    loader.style.display = "block";

    setTimeout(() => {
      this.videoFile = file;
      if (this.videoObjectURL) {
        URL.revokeObjectURL(this.videoObjectURL);
      }
      this.videoObjectURL = URL.createObjectURL(file);
      this.data = {
        file: {
          name: file.name,
          size: file.size,
          type: file.type,
          url: this.videoObjectURL,
        },
      };
      this.showVideo();
    }, 1000);
  }

  showVideo() {
    this.wrapper.innerHTML = "";

    const video = document.createElement("video");
    video.controls = true;
    video.src = this.data.file.url;
    video.style.cssText = `
      max-width: 100%;
      border-radius: 8px;
      background: #000;
    `;

    const name = document.createElement("p");
    name.textContent = this.data.file.name;
    name.style.fontSize = "12px";

    const removeBtn = document.createElement("button");
    removeBtn.textContent = "Supprimer";
    removeBtn.style.cssText = `
      background: #ff4d4f;
      color: white;
      border: none;
      padding: 5px 10px;
      border-radius: 4px;
      margin-top: 10px;
      cursor: pointer;
    `;
    removeBtn.onclick = () => this.changeVideo();

    this.wrapper.appendChild(video);
    this.wrapper.appendChild(name);
    this.wrapper.appendChild(removeBtn);
  }

  changeVideo() {
    if (this.videoObjectURL) {
      URL.revokeObjectURL(this.videoObjectURL);
    }
    this.data = {};
    this.videoFile = null;
    this.videoObjectURL = null;
    this.showUploader();
  }

  showError(message) {
    const error = document.createElement("div");
    error.textContent = message;
    error.style.cssText = `
      color: #721c24;
      background: #f8d7da;
      padding: 10px;
      margin: 10px 0;
      border-radius: 4px;
    `;
    this.wrapper.appendChild(error);
    setTimeout(() => {
      error.remove();
    }, 4000);
  }

  formatFileSize(bytes) {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }

  save() {
    if (this.data.file) {
      return {
        file: {
          name: this.data.file.name,
          size: this.data.file.size,
          type: this.data.file.type,
          url: this.data.file.url,
        },
      };
    }
    return this.data;
  }

  destroy() {
    if (this.videoObjectURL) {
      URL.revokeObjectURL(this.videoObjectURL);
      this.videoObjectURL = null;
    }
  }

  static get isReadOnlySupported() {
    return true;
  }
}

window.VideoTool = VideoTool;