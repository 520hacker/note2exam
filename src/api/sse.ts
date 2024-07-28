import request from '../lib/request';

export function getSharedToken(): string {
    return 'sk-1e49426A5A63Ee3C33256F17EF152C02';
}

export async function makeSingleChat(param: Record<string, any>): Promise<any> {
    let token = localStorage.getItem('CSK');
    if (!token) {
        token = getSharedToken();
    }

    if (!token) {
        return Promise.resolve({
            "success": false,
            "errorMessage": "SK value miss",
            "errorCode": 401,
            "executionTime": 0
        });
    }

    try { 
        const data = await request('/v1/chat/completions', {
            data: param,
            method: 'post',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        return data;
    } catch (error) {
        console.error('Error making single chat:', error);
        throw error;
    }
}
