document.getElementById("save-button").addEventListener("click", async function() {
    const title = document.getElementById("project-title").value;
    const photo = document.getElementById("project-photo").files[0];
    const language = document.getElementById("language-used").value;
    const type = document.getElementById("project-type").value;
    const description = document.getElementById("description").value;

    if (!photo) {
        console.error("Nenhuma foto selecionada!");
        return;
    }

    // Usando FormData para enviar o arquivo junto com os dados do projeto
    const formData = new FormData();
    formData.append('title', title);
    formData.append('language', language);
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
            displayProjects(); // Atualizar a lista de projetos
        } else {
            console.error('Erro ao salvar projeto:', result.message);
        }
    } catch (error) {
        console.error('Erro ao enviar dados:', error);
    }

    document.getElementById("project-form").reset();
});

// Função para exibir os projetos
async function displayProjects() {
    const apiUrl = 'http://localhost:3000/projetos'; // URL do backend

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data.status === 'success') {
            const projectsContainer = document.getElementById('project-cards-container');
            projectsContainer.innerHTML = ''; // Limpa o conteúdo existente

            data.data.forEach(project => {
                const projectDiv = document.createElement('div');
                projectDiv.className = 'project-card';
                
                projectDiv.innerHTML = `
                    <img src="${project.imageUrl}" alt="Foto do Projeto">
                    <h3>${project.title}</h3>
                    <p><strong>Linguagem Usada:</strong> ${project.language}</p>
                    <p><strong>Tipo de Projeto:</strong> ${project.type}</p>
                    <p>${project.description}</p>
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

// Chama a função para exibir os projetos quando a página carrega
document.addEventListener('DOMContentLoaded', displayProjects);
