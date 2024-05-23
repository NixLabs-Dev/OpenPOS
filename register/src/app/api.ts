import { invoke } from '@tauri-apps/api/tauri'


export class APIManager {
// Internal Values
    private backendAddress: string = "";

    
// Class Initialization Tools
    constructor() {
        this.LoadAsync()
    }

    private LoadAsync = async () => {
        invoke("get_environment_variable", { name: "SERVER_IP" }).then((hostIp) => {
            this.backendAddress = String(hostIp);
        })
    };


// Helper Functions
    public getBackendAddress(): string {
        console.log(`ip is: ${this.backendAddress}`)
        return this.backendAddress
    }

    public submitOrder(): boolean {
        return true
    }
}