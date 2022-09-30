import { createClient } from '@supabase/supabase-js'
import { SUPABASE_URL } from '../constants/index'
require("dotenv").config();

class DbEntity {
    constructor() {
        this.client = createClient(SUPABASE_URL, process.env.SUPABASE_ANON_KEY)
    }
}

class Sessions extends DbEntity {    
    
    constructor() {
        super()
    }
    
    async getSessions() {
        const { data: sessions, err } = await this.client.from('sessions').select('*')
        if(err) {
            console.error("Error fetching data from db api:", err)
        }
        else {
            return sessions
        }
    }
}

module.exports = {
    Sessions
}