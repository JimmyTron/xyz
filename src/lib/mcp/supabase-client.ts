/**
 * Supabase MCP Client Integration
 * 
 * This module provides helper functions to interact with Supabase
 * via MCP (Model Context Protocol) server for enhanced database operations.
 * 
 * Note: MCP Supabase functions are called directly via the MCP server,
 * not through this file. This file serves as documentation and type definitions.
 */

/**
 * MCP Supabase Functions Available:
 * 
 * Project Management:
 * - mcp_Supabase_list_projects()
 * - mcp_Supabase_get_project(project_id)
 * - mcp_Supabase_get_project_url(project_id)
 * - mcp_Supabase_get_publishable_keys(project_id)
 * 
 * Database Operations:
 * - mcp_Supabase_list_tables(project_id, schemas?)
 * - mcp_Supabase_execute_sql(project_id, query)
 * - mcp_Supabase_apply_migration(project_id, name, query)
 * - mcp_Supabase_list_migrations(project_id)
 * 
 * Type Generation:
 * - mcp_Supabase_generate_typescript_types(project_id)
 * 
 * Monitoring:
 * - mcp_Supabase_get_logs(project_id, service)
 * - mcp_Supabase_get_advisors(project_id, type)
 * 
 * Edge Functions:
 * - mcp_Supabase_list_edge_functions(project_id)
 * - mcp_Supabase_get_edge_function(project_id, function_slug)
 * - mcp_Supabase_deploy_edge_function(project_id, name, files)
 */

export interface SupabaseMCPConfig {
  projectId: string
}

/**
 * Helper to get the current Supabase project ID from environment
 */
export function getSupabaseProjectId(): string | null {
  const url = import.meta.env.VITE_SUPABASE_URL
  if (!url) return null
  
  // Extract project ref from URL: https://xxxxx.supabase.co
  const match = url.match(/https?:\/\/([^.]+)\.supabase\.co/)
  return match ? match[1] : null
}

/**
 * Type definitions for common Supabase MCP operations
 */
export type SupabaseService = 
  | 'api' 
  | 'branch-action' 
  | 'postgres' 
  | 'edge-function' 
  | 'auth' 
  | 'storage' 
  | 'realtime'

export type AdvisorType = 'security' | 'performance'





