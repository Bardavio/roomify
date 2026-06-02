const jsonError = (status, message, extra = {}) => {
    return new Response(JSON.stringify({ error: message, ...extra }), {
        status,
        headers: { 'Content-Type': 'application/json' }
    });
};

const getUserId = async (userPuter) => {
    if (!userPuter) return null;
    try {
        const userObj = await userPuter.auth.getUser();
        return userObj?.username || userObj?.uuid || null;
    } catch (e) {
        return null;
    }
};

const PROJECT_PREFIX = 'roomifi_project_';

// POST: /api/projects/save - Guarda o actualiza un proyecto en el KV del usuario
router.post('/api/projects/save', async ({ request, user }) => {
    try {
        const userPuter = user.puter;
        if (!userPuter) return jsonError(401, 'Authentication failed');

        const body = await request.json();
        const project = body?.project;

        if (!project?.id || !project?.originalImage) return jsonError(400, 'Project not found');

        const payload = {
            ...project,
            updatedAt: new Date().toISOString(),
        };

        const userId = await getUserId(userPuter);
        if (!userId) return jsonError(401, 'Authentication failed');

        const key = `${PROJECT_PREFIX}${project.id}`;
        await userPuter.kv.set(key, payload);

        return new Response(JSON.stringify({ success: true, project: payload }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (e) {
        return jsonError(500, 'Failed to save project', { message: e.message || 'Unknown error' });
    }
});

// GET: /api/projects/list - Lista todos los proyectos del KV del usuario con el prefijo
router.get('/api/projects/list', async ({ request, user }) => {
    try {
        const userPuter = user.puter;
        if (!userPuter) return jsonError(401, 'Authentication failed');

        const items = await userPuter.kv.list(`${PROJECT_PREFIX}*`, true);
        const projects = items.map(item => item.value);

        return new Response(JSON.stringify({ projects }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (e) {
        return jsonError(500, 'Failed to list projects', { message: e.message || 'Unknown error' });
    }
});

// GET: /api/projects/get - Recupera un proyecto específico por ID
router.get('/api/projects/get', async ({ request, user }) => {
    try {
        const userPuter = user.puter;
        if (!userPuter) return jsonError(401, 'Authentication failed');

        const url = new URL(request.url);
        const id = url.searchParams.get('id');
        if (!id) return jsonError(400, 'ID parameter is missing');

        const key = `${PROJECT_PREFIX}${id}`;
        const project = await userPuter.kv.get(key);
        if (!project) return jsonError(404, 'Project not found');

        return new Response(JSON.stringify({ project }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (e) {
        return jsonError(500, 'Failed to get project', { message: e.message || 'Unknown error' });
    }
});
