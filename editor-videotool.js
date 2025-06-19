// export default class VideoTool {
//   static get toolbox() {
//     return {
//       title: 'Vidéo',
//       icon: '<svg width="17" height="15" viewBox="0 0 24 24"><path d="M17 10.5V6c0-1.1-.9-2-2-2H4C2.89 4 2 4.9 2 6v12c0 1.1.89 2 2 2h11c1.1 0 2-.9 2-2v-4.5l5 4.5v-15l-5 4.5z"/></svg>'
//     };
//   }

//   constructor({ data }) {
//     this.data = data || {};
//     this.wrapper = null;
//   }

//   render() {
//     this.wrapper = document.createElement('div');
//     this.wrapper.classList.add('video-tool-wrapper');

//     if (this.data.file && this.data.file.url) {
//       this.showVideo();
//     } else {
//       this.showUploader();
//     }

//     return this.wrapper;
//   }

//   showUploader() {
//     this.wrapper.innerHTML = '';

//     const uploadContainer = document.createElement('div');
//     uploadContainer.classList.add('video-upload-container');
//     uploadContainer.style.cssText = `
//       border: 2px dashed #ccc;
//       border-radius: 8px;
//       padding: 20px;
//       text-align: center;
//       background-color: #f9f9f9;
//       cursor: pointer;
//       transition: border-color 0.3s ease;
//     `;

//     const input = document.createElement('input');
//     input.type = 'file';
//     input.accept = 'video/*';
//     input.style.display = 'none';

//     const uploadText = document.createElement('p');
//     uploadText.textContent = 'Cliquez pour sélectionner une vidéo';
//     uploadText.style.cssText = `
//       margin: 0;
//       color: #666;
//       font-size: 14px;
//     `;

//     const loadingText = document.createElement('p');
//     loadingText.textContent = 'Upload en cours...';
//     loadingText.style.cssText = `
//       margin: 0;
//       color: #007cba;
//       font-size: 14px;
//       display: none;
//     `;

//     uploadContainer.appendChild(uploadText);
//     uploadContainer.appendChild(loadingText);
//     uploadContainer.appendChild(input);

//     // Event listeners
//     uploadContainer.addEventListener('click', () => input.click());

//     uploadContainer.addEventListener('dragover', (e) => {
//       e.preventDefault();
//       uploadContainer.style.borderColor = '#007cba';
//     });

//     uploadContainer.addEventListener('dragleave', () => {
//       uploadContainer.style.borderColor = '#ccc';
//     });

//     uploadContainer.addEventListener('drop', (e) => {
//       e.preventDefault();
//       uploadContainer.style.borderColor = '#ccc';
//       const files = e.dataTransfer.files;
//       if (files.length > 0 && files[0].type.startsWith('video/')) {
//         this.uploadFile(files[0], uploadText, loadingText);
//       }
//     });

//     input.addEventListener('change', (e) => {
//       const file = e.target.files[0];
//       if (file) {
//         this.uploadFile(file, uploadText, loadingText);
//       }
//     });

//     this.wrapper.appendChild(uploadContainer);
//   }

//   async uploadFile(file, uploadText, loadingText) {
//     try {
//       // Afficher le loading
//       uploadText.style.display = 'none';
//       loadingText.style.display = 'block';

//       const formData = new FormData();
//       formData.append('video', file);

//       // Récupérer le token CSRF
//       const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content;

//       const headers = {};
//       if (csrfToken) {
//         headers['X-CSRF-TOKEN'] = csrfToken;
//       }

//       const response = await fetch('/api/upload/video', {
//         method: 'POST',
//         headers: headers,
//         body: formData
//       });

//       if (!response.ok) {
//         throw new Error(`Erreur HTTP: ${response.status}`);
//       }

//       const result = await response.json();

//       // Vérifier que la réponse contient les données nécessaires
//       if (result.url) {
//         this.data = {
//           file: {
//             url: result.url,
//             type: result.type || file.type,
//             name: result.name || file.name,
//             size: result.size || file.size
//           }
//         };

//         // Afficher la vidéo
//         this.showVideo();
//       } else {
//         throw new Error('URL de la vidéo non reçue du serveur');
//       }

//     } catch (error) {
//       console.error('Erreur lors de l\'upload:', error);

//       // Afficher l'erreur
//       loadingText.textContent = `Erreur: ${error.message}`;
//       loadingText.style.color = '#dc3545';

//       // Remettre l'uploader après 3 secondes
//       setTimeout(() => {
//         uploadText.style.display = 'block';
//         loadingText.style.display = 'none';
//         loadingText.style.color = '#007cba';
//         loadingText.textContent = 'Upload en cours...';
//       }, 3000);
//     }
//   }

//   showVideo() {
//     this.wrapper.innerHTML = '';

//     const videoContainer = document.createElement('div');
//     videoContainer.classList.add('video-container');
//     videoContainer.style.cssText = `
//       position: relative;
//       border-radius: 8px;
//       overflow: hidden;
//       box-shadow: 0 2px 8px rgba(0,0,0,0.1);
//     `;

//     const video = this.createVideoElement();

//     // Bouton pour changer la vidéo
//     const changeButton = document.createElement('button');
//     changeButton.textContent = 'Changer la vidéo';
//     changeButton.style.cssText = `
//       position: absolute;
//       top: 10px;
//       right: 10px;
//       background: rgba(0,0,0,0.7);
//       color: white;
//       border: none;
//       padding: 5px 10px;
//       border-radius: 4px;
//       cursor: pointer;
//       font-size: 12px;
//       z-index: 10;
//     `;

//     changeButton.addEventListener('click', () => {
//       this.data = {};
//       this.showUploader();
//     });

//     videoContainer.appendChild(video);
//     videoContainer.appendChild(changeButton);
//     this.wrapper.appendChild(videoContainer);
//   }

//   createVideoElement() {
//     const video = document.createElement('video');
//     video.controls = true;
//     video.style.cssText = `
//       width: 100%;
//       max-width: 600px;
//       height: auto;
//       display: block;
//     `;

//     // Ajouter la source
//     const source = document.createElement('source');
//     source.src = this.data.file.url;
//     source.type = this.data.file.type;

//     video.appendChild(source);

//     // Message de fallback
//     video.innerHTML += 'Votre navigateur ne supporte pas la lecture de vidéos HTML5.';

//     // Gestion des erreurs de chargement
//     video.addEventListener('error', (e) => {
//       console.error('Erreur lors du chargement de la vidéo:', e);
//       const errorMsg = document.createElement('div');
//       errorMsg.textContent = 'Erreur lors du chargement de la vidéo';
//       errorMsg.style.cssText = `
//         padding: 20px;
//         background: #f8d7da;
//         color: #721c24;
//         border-radius: 4px;
//         text-align: center;
//       `;
//       video.parentNode.replaceChild(errorMsg, video);
//     });

//     return video;
//   }

//   save() {
//     return this.data;
//   }

//   static get isReadOnlySupported() {
//     return true;
//   }
// }

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
        margin: 10px 0 10px 0;
        border-radius: 3px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        background-color: #ffffff;
        cursor: pointer;
        transition: all 0.3s ease;
        min-height: 45px;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 20px;
    `;

        const input = document.createElement("input");
        input.type = "file";
        input.accept = "video/*";
        input.style.display = "none";
        input.id = `video-input-${Date.now()}`;

        const uploadContent = document.createElement("div");
        uploadContent.style.cssText = `
        display: flex;
        align-items: center;
        gap: 10px;
        color: #999DA7;
        font-size: 16px;
        font-weight: 500;
    `;

        const uploadIcon = document.createElement("div");
        uploadIcon.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" fill="#999DA7" viewBox="0 0 24 24">
            <path d="M17 10.5V6c0-1.1-.9-2-2-2H4C2.9 4 2 4.9 2 6v12c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2v-4.5l4 4v-11l-4 4z"/>
        </svg>
    `;

        const uploadText = document.createElement("span");
        uploadText.textContent = "Sélectionner une vidéo";

        // uploadContent.appendChild(uploadIcon);
        uploadContent.appendChild(uploadText);

        const loadingIndicator = document.createElement("div");
        loadingIndicator.style.cssText = `
        display: none;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        margin-top: 10px;
    `;
        loadingIndicator.innerHTML = `
        <div style="
            width: 32px;
            height: 32px;
            border: 4px solid #e9ecef;
            border-top: 4px solid #007cba;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-bottom: 10px;
        "></div>
        <p style="margin: 0; color: #007cba; font-weight: 500; font-size: 14px;">
            Traitement de la vidéo...
        </p>
    `;

        const style = document.createElement("style");
        style.textContent = `
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        .video-upload-container:hover {
            background-color: #e9ecef;
        }
    `;
        document.head.appendChild(style);

        uploadContainer.appendChild(uploadContent);
        uploadContainer.appendChild(loadingIndicator);
        uploadContainer.appendChild(input);

        uploadContainer.addEventListener("click", () => input.click());

        uploadContainer.addEventListener("dragover", (e) => {
            e.preventDefault();
            uploadContainer.style.backgroundColor = "#e3f2fd";
            uploadContainer.style.transform = "scale(1.01)";
        });

        uploadContainer.addEventListener("dragleave", () => {
            uploadContainer.style.backgroundColor = "#f8f9fa";
            uploadContainer.style.transform = "scale(1)";
        });

        uploadContainer.addEventListener("drop", (e) => {
            e.preventDefault();
            uploadContainer.style.backgroundColor = "#f8f9fa";
            uploadContainer.style.transform = "scale(1)";
            const files = e.dataTransfer.files;
            if (files.length > 0 && files[0].type.startsWith("video/")) {
                this.handleFileSelection(
                    files[0],
                    uploadContent,
                    loadingIndicator
                );
            } else {
                this.showError("Veuillez sélectionner un fichier vidéo valide");
            }
        });

        input.addEventListener("change", (e) => {
            const file = e.target.files[0];
            if (file) {
                this.handleFileSelection(file, uploadContent, loadingIndicator);
            }
        });

        this.wrapper.appendChild(uploadContainer);
    }

    handleFileSelection(file, uploadContent, loadingIndicator) {
        const maxSize = 100 * 1024 * 1024;
        if (file.size > maxSize) {
            this.showError(
                "Le fichier est trop volumineux. Taille maximum: 100MB"
            );
            return;
        }

        uploadContent.style.display = "none";
        loadingIndicator.style.display = "flex";

        setTimeout(() => {
            this.processVideoFile(file);
        }, 1000);
    }

    processVideoFile(file) {
        try {
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
                    lastModified: file.lastModified,
                    url: this.videoObjectURL,
                    localFile: true,
                },
            };
            this.showVideo();
        } catch (error) {
            console.error("Erreur lors du traitement du fichier:", error);
            this.showError("Erreur lors du traitement du fichier vidéo");
        }
    }

    showVideo() {
        this.wrapper.innerHTML = "";

        const videoContainer = document.createElement("div");
        videoContainer.classList.add("video-container");
        videoContainer.style.cssText = `
        position: relative;
        margin: 10px 0 10px 0;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 4px 20px rgba(0,0,0,0.15);
        background: #000;
        display: flex;
        justify-content: center;
        align-items: center;
    `;

        const video = this.createVideoElement();

        const fileInfo = document.createElement("div");
        fileInfo.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        background: linear-gradient(rgba(0,0,0,0.8), transparent);
        color: white;
        padding: 15px;
        font-size: 12px;
        transform: translateY(-100%);
        transition: transform 0.3s ease;
        z-index: 10;
    `;

        fileInfo.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center;">
            <div>
                <strong>${this.data.file.name}</strong><br>
                ${this.formatFileSize(this.data.file.size)} • ${
            this.data.file.type
        }
            </div>
            <div style="display: flex; gap: 10px;">
                <button class="change-video-btn" style="
                    background: rgba(255, 255, 255, 0.2);
                    border: 1px solid rgba(255, 255, 255, 0.3);
                    color: white;
                    padding: 5px 12px;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 11px;
                    transition: background 0.2s ease;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                ">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ff4d4f" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                        <path d="M10 11v6" />
                        <path d="M14 11v6" />
                        <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                    </svg>
                    Supprimer
                </button>
                <button class="download-video-btn" style="
                    background: rgba(255, 255, 255, 0.2);
                    border: 1px solid rgba(255, 255, 255, 0.3);
                    color: white;
                    padding: 5px 12px;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 11px;
                    transition: background 0.2s ease;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                ">
                    <svg width="14" height="14" fill="#50c53a" viewBox="0 0 498.779 498.779" xmlns="http://www.w3.org/2000/svg">
                        <g>
                            <polygon points="498.779,366.435 452.881,366.435 452.881,439.875 45.9,439.875 45.9,367.965 0,367.965 0,485.774 498.779,485.774"/>
                            <polygon points="134.086,177.664 70.334,177.664 254.209,406.215 438.082,177.664 374.332,177.664 374.332,13.005 134.086,13.005"/>
                        </g>
                    </svg>
                    Télécharger
                </button>
            </div>
        </div>
    `;

        fileInfo
            .querySelector(".change-video-btn")
            .addEventListener("click", (e) => {
                e.stopPropagation();
                this.changeVideo();
            });

        fileInfo
            .querySelector(".download-video-btn")
            .addEventListener("click", (e) => {
                e.stopPropagation();
                this.downloadVideo();
            });

        videoContainer.addEventListener("mouseenter", () => {
            fileInfo.style.transform = "translateY(0)";
        });

        videoContainer.addEventListener("mouseleave", () => {
            fileInfo.style.transform = "translateY(-100%)";
        });

        videoContainer.appendChild(video);
        videoContainer.appendChild(fileInfo);
        this.wrapper.appendChild(videoContainer);
    }

    createVideoElement() {
        const video = document.createElement("video");
        video.controls = true;
        video.preload = "metadata";

        const width = this.config.width || 400;
        video.style.cssText = `
        width: 100%;
        max-width: 400px;
        max-height: 300px;
        height: auto;
        display: block;
        margin: 0 auto;
        background: #000;
        object-fit: contain;
    `;

        video.src = this.data.file.url;

        video.addEventListener("error", (e) => {
            console.error("Erreur lors du chargement de la vidéo:", e);
            this.showError("Erreur lors du chargement de la vidéo");
        });

        video.addEventListener("loadedmetadata", () => {
            console.log(
                `Vidéo chargée: ${video.videoWidth}x${video.videoHeight}, durée: ${video.duration}s`
            );
        });

        return video;
    }

    changeVideo() {
        if (this.videoObjectURL) {
            URL.revokeObjectURL(this.videoObjectURL);
            this.videoObjectURL = null;
        }
        this.data = {};
        this.videoFile = null;
        this.showUploader();
    }

    downloadVideo() {
        if (this.videoFile) {
            const link = document.createElement("a");
            link.href = this.videoObjectURL;
            link.download = this.data.file.name;
            link.style.display = "none";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }

    showError(message) {
        const errorDiv = document.createElement("div");
        errorDiv.style.cssText = `
      background: #f8d7da;
      color: #721c24;
      padding: 15px;
      border-radius: 8px;
      text-align: center;
      margin: 10px 0;
      border: 1px solid #f5c6cb;
    `;
        errorDiv.textContent = message;

        this.wrapper.appendChild(errorDiv);

        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.parentNode.removeChild(errorDiv);
            }
        }, 5000);
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
                    lastModified: this.data.file.lastModified,
                    localFile: true,
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
