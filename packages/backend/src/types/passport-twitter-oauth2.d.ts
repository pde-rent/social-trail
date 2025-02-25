declare module 'passport-twitter-oauth2' {
  import { Strategy as OAuth2Strategy } from 'passport-oauth2';
  
  export interface StrategyOptions {
    clientID: string;
    clientSecret: string;
    callbackURL: string;
    clientType?: 'confidential' | 'public';
    includeEmail?: boolean;
    pkce?: boolean;
    state?: boolean;
  }
  
  export class Strategy extends OAuth2Strategy {
    constructor(options: StrategyOptions, verify: any);
  }
} 