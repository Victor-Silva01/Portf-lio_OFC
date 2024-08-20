document.getElementById("save-button").addEventListener("click", async function() {
    const title = document.getElementById("project-title").value;
    const photo = document.getElementById("project-photo").files[0];
    const languages = Array.from(document.getElementById("language-used").selectedOptions).map(option => option.value);
    const type = document.getElementById("project-type").value;
    const description = document.getElementById("description").value;

    if (!photo) {
        console.error("Nenhuma foto selecionada!");
        return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('languages', JSON.stringify(languages)); // Envia o array de linguagens como JSON
    formData.append('type', type);
    formData.append('description', description);
    formData.append('photo', photo);

    try {
        const response = await fetch('/projetos', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();
        if (result.status === 'success') {
            console.log('Projeto salvo com sucesso!');
            displayProjects('saved-projects-container');
            displayProjects('my-projects-container');
            displayProjects('project-cards-container');  // Adiciona a chamada para preencher a seção de projetos
        } else {
            console.error('Erro ao salvar projeto:', result.message);
        }
    } catch (error) {
        console.error('Erro ao enviar dados:', error);
    }

    document.getElementById("project-form").reset();
});

async function displayProjects(containerId) {
    const apiUrl = 'http://localhost:3000/projetos'; // URL do backend

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data.status === 'success') {
            const projectsContainer = document.getElementById(containerId);
            projectsContainer.innerHTML = ''; // Limpa o conteúdo existente

            data.data.forEach(project => {
                const projectDiv = document.createElement('div');
                projectDiv.className = 'project-card';

                // Usa a URL da imagem ou uma imagem padrão
                const imageUrl = project.imageUrl ? project.imageUrl : 'path/to/default-image.jpg';

                projectDiv.innerHTML = `
                    <img src="${imageUrl}" alt="Foto do Projeto">
                    <h3>${project.title}</h3>
                    <p><strong>Linguagens Usadas:</strong> ${JSON.parse(project.languages).join(', ')}</p>
                    <p><strong>Tipo de Projeto:</strong> ${project.type}</p>
                    <p>${project.description}</p>
                    <button class="delete" onclick="deleteProject(${project.id})">Excluir</button>
                `;

                projectsContainer.appendChild(projectDiv);
            });
        } else {
            console.error('Erro ao carregar projetos:', data.message);
            document.getElementById('status-message').innerText = 'Erro ao carregar projetos.';
            document.getElementById('status-message').style.display = 'block';
        }
    } catch (error) {
        console.error('Erro na requisição:', error);
        document.getElementById('status-message').innerText = 'Erro na requisição.';
        document.getElementById('status-message').style.display = 'block';
    }
}

async function deleteProject(projectId) {
    try {
        const response = await fetch(`/projetos/${projectId}`, {
            method: 'DELETE'
        });

        const result = await response.json();
        if (result.status === 'success') {
            console.log('Projeto excluído com sucesso!');
            displayProjects('saved-projects-container');
            displayProjects('my-projects-container');
            displayProjects('project-cards-container');  // Atualiza a seção de projetos após a exclusão
        } else {
            console.error('Erro ao excluir projeto:', result.message);
        }
    } catch (error) {
        console.error('Erro ao excluir projeto:', error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    displayProjects('saved-projects-container');
    displayProjects('my-projects-container');
    displayProjects('project-cards-container');  // Carrega os projetos na seção de projetos ao carregar a página
});
