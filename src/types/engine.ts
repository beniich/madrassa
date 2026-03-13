
export type BlockType =
    | 'text'
    | 'heading_1'
    | 'heading_2'
    | 'heading_3'
    | 'bulleted_list_item'
    | 'numbered_list_item'
    | 'to_do'
    | 'toggle'
    | 'image'
    | 'file'
    | 'code'
    | 'quote'
    | 'divider'
    | 'callout'
    | 'table'
    | 'column_list'
    | 'ai_block' // Special AI Block
    | 'automation_trigger'; // Special Automation Block

export interface Block {
    id: string;
    type: BlockType;
    content: Record<string, unknown> | string; // Flexible content based on type (text, url, checked, etc.)
    properties?: Record<string, unknown>; // Additional metadata (color, icon, etc.)
    children?: Block[]; // Nested blocks
    parentId?: string;
    createdAt: string;
    updatedAt: string;
    createdBy?: string;
}

export type PropertyType =
    | 'text'
    | 'number'
    | 'select'
    | 'multi_select'
    | 'status'
    | 'date'
    | 'person'
    | 'files'
    | 'checkbox'
    | 'url'
    | 'email'
    | 'phone'
    | 'formula'
    | 'relation'
    | 'rollup'
    | 'created_time'
    | 'created_by'
    | 'last_edited_time'
    | 'last_edited_by';

export interface DatabaseProperty {
    id: string;
    name: string;
    type: PropertyType;
    options?: { // For select, multi_select, status
        id: string;
        name: string;
        color?: string;
    }[];
    relation?: {
        databaseId: string;
        type: 'one_to_one' | 'one_to_many' | 'many_to_many';
    };
}

export interface DatabaseView {
    id: string;
    name: string;
    type: 'table' | 'board' | 'timeline' | 'calendar' | 'list' | 'gallery';
    filter?: Record<string, unknown>; // Complex filter object
    sort?: {
        property: string;
        direction: 'ascending' | 'descending';
    }[];
    groupBy?: string; // Property ID to group by
}

export interface Database {
    id: string;
    name: string;
    description?: string;
    icon?: string;
    cover?: string;
    properties: Record<string, DatabaseProperty>; // Schema definition
    views: DatabaseView[];
    createdTime: string;
    lastEditedTime: string;
}

export interface RecordPage {
    id: string;
    databaseId: string;
    icon?: string;
    cover?: string;
    properties: Record<string, unknown>; // Values for the properties defined in Database
    blocks: Block[]; // Content of the page
    createdTime: string;
    lastEditedTime: string;
}

// AI Integration Helpers
export interface AIBlockState {
    prompt: string;
    isGenerating: boolean;
    output?: string;
    context?: string[]; // IDs of related records or blocks to include in context
}
