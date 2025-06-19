/**
 * @internal
 * Structure for building the generated registry file content.
 * 
 * This interface is used internally by the Template class to organize
 * the different sections of the generated file before combining them.
 */
export interface GeneratedTemplate {
  /** File header comments */
  header: string[];
  /** Import statements */
  imports: string[];
  /** Component registration statements */
  registrations: string[];
  /** Final combined content */
  content?: string;
}
