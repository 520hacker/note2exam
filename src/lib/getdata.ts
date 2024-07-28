import service from './request'; // 确保路径正确

// 定义 get 方法
export const getData = async (url: string, params?: Record<string, any>) => {
    try {
        const response = await service.get(url, { params });
        return response;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
};

// 定义 post 方法
export const postData = async (url: string, data: Record<string, any>, header: Record<string, any>) => {
    try {
        const response = await service.post(url, data, header);
        return response;
    } catch (error) {
        console.error('Error posting data:', error);
        throw error;
    }
};