import axios from 'axios';
import { API_BASE_URL } from '../types';
import { getOrCreateGuestToken } from '../utils/guestToken';

const INITIALIZE_MPESA_ENDPOINT = `${API_BASE_URL}/payments/initialize-mpesa`;

interface MpesaResponse {
    status: string;
    reference: string;
    display_text: string;
}

export async function initializeMpesaPaymentApi(planName: string, phoneNumber: string): Promise<MpesaResponse> {
    const token = getOrCreateGuestToken();
    if (!token) throw new Error("User token not found.");

    const response = await axios.post(
        INITIALIZE_MPESA_ENDPOINT,
        {
            plan_name: planName,
            phone_number: phoneNumber,
        },
        {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        }
    );

    return response.data;
}