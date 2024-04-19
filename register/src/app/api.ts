import { invoke } from '@tauri-apps/api/tauri'


export class APIManager {
// Internal Values
    private backendAddress: string = "";

    
// Class Initialization Tools
    constructor() {
        this.LoadAsync()
    }

    private LoadAsync = async () => {
        this.backendAddress = await invoke("get_environment_variable", { name: "SERVER_IP" }).then((EnvIP) => {return String(EnvIP)})
    };


// Helper Functions
    public getBackendAddress(): string {
        return this.backendAddress
    }

    public submitOrder(): boolean {
        return true
    }
}