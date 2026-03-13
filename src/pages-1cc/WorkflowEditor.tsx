import { useCallback, useEffect, useState, useRef } from 'react';
import {
    ReactFlow,
    MiniMap,
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    addEdge,
    Connection,
    Edge,
    ReactFlowProvider,
    BackgroundVariant,
    Node,
    ReactFlowInstance,
} from '@xyflow/react';

interface CustomNodeData extends Record<string, unknown> {
    label: string;
    icon: string;
    description?: string;
}
import '@xyflow/react/dist/style.css';

import { useParams } from 'react-router-dom';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Button } from '@/components/ui-1cc/button';
import { Save, Play, ArrowLeft } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '@/hooks-1cc/use-toast';

import CustomNode from '@/components/workflow/CustomNode';
import { WorkflowSidebar } from '@/components/workflow/WorkflowSidebar';
import { NodeConfigPanel } from '@/components/workflow/NodeConfigPanel';

const nodeTypes = {
    custom: CustomNode,
};

const initialNodes: Node<CustomNodeData>[] = [
    {
        id: '1',
        type: 'custom',
        position: { x: 250, y: 100 },
        data: { label: 'Nouveau Lead', icon: 'trigger', description: 'Source: Formulaire Web' },
    },
    {
        id: '2',
        type: 'custom',
        position: { x: 250, y: 300 },
        data: { label: 'Envoyer Email', icon: 'email', description: 'Template: Bienvenue' },
    },
];

const initialEdges = [{ id: 'e1-2', source: '1', target: '2', animated: true }];

const WorkflowEditorContent = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { toast } = useToast();
    const reactFlowWrapper = useRef<HTMLDivElement>(null);

    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);
    const [selectedNode, setSelectedNode] = useState<{ id: string, data: CustomNodeData } | null>(null);
    const location = useLocation();

    useEffect(() => {
        const tmpl = (location.state as { template?: { nodes: { id?: string; type: string; name?: string }[] } })?.template;
        if (tmpl?.nodes) {
            const flowNodes = tmpl.nodes.map((n, idx: number) => ({
                id: n.id ?? `node-${idx}`,
                type: n.type === 'ai-node' ? 'custom' : n.type,
                position: { x: 250 + idx * 150, y: 100 },
                data: { label: n.name ?? n.type, icon: n.type, description: '' },
            }));
            setNodes(flowNodes);
            const flowEdges = flowNodes.slice(0, -1).map((node, i) => ({
                id: `e${node.id}-${flowNodes[i + 1].id}`,
                source: node.id,
                target: flowNodes[i + 1].id,
                animated: true,
            }));
            setEdges(flowEdges);
        }
    }, [location.state, setNodes, setEdges]);

    const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
        setSelectedNode({ id: node.id, data: node.data as CustomNodeData });
    }, []);

    const onPaneClick = useCallback(() => {
        setSelectedNode(null);
    }, []);

    const updateNodeData = (id: string, newData: CustomNodeData) => {
        setNodes((nds) =>
            nds.map((node) => {
                if (node.id === id) {
                    return { ...node, data: newData };
                }
                return node;
            })
        );
        setSelectedNode({ id, data: newData });
    };

    const onConnect = useCallback(
        (params: Edge | Connection) =>
            setEdges((eds) => [
                ...eds,
                {
                    id: `${params.source}-${params.target}`,
                    source: params.source as string,
                    target: params.target as string,
                    animated: true,
                },
            ]),
        [setEdges],
    );

    const onDragOver = useCallback((event: React.DragEvent) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    const onDrop = useCallback(
        (event: React.DragEvent) => {
            event.preventDefault();

            const type = event.dataTransfer.getData('application/reactflow');
            const label = event.dataTransfer.getData('application/reactflow-label');

            if (typeof type === 'undefined' || !type) {
                return;
            }

            const position = reactFlowInstance.screenToFlowPosition({
                x: event.clientX,
                y: event.clientY,
            });

            const newNode = {
                id: `${type}-${Date.now()}`,
                type: 'custom',
                position,
                data: { label: `${label}`, icon: type, description: '' }, // Add empty description to satisfy type
            };

            setNodes((nds) => nds.concat(newNode));
        },
        [reactFlowInstance, setNodes],
    );

    const handleSave = () => {
        // In a real app, you would save nodes and edges to backend here
        console.log('Saving workflow:', { nodes, edges });
        toast({
            title: "Workflow sauvegardé",
            description: "Votre configuration a été enregistrée avec succès.",
        });
    };

    return (
        <div className="h-[calc(100vh-2rem)] flex flex-col">
            {/* Header Toolbar */}
            <div className="flex items-center justify-between p-4 border-b bg-background/50 backdrop-blur-sm">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => navigate('/workflows')}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <h1 className="text-xl font-bold">Éditeur de Workflow</h1>
                        <p className="text-xs text-muted-foreground">ID: {id || 'Nouveau'}</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => console.log('Test run')}>
                        <Play className="h-4 w-4 mr-2" /> Tester
                    </Button>
                    <Button variant="default" size="sm" onClick={handleSave}>
                        <Save className="h-4 w-4 mr-2" /> Sauvegarder
                    </Button>
                </div>
            </div>

            {/* Editor Area */}
            <div className="flex flex-1 overflow-hidden">
                <div className="flex-1 h-full relative" ref={reactFlowWrapper}>
                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        onConnect={onConnect}
                        onInit={setReactFlowInstance}
                        onDrop={onDrop}
                        onDragOver={onDragOver}
                        nodeTypes={nodeTypes}
                        fitView
                        onNodeClick={onNodeClick}
                        onPaneClick={onPaneClick}
                    >
                        <Controls />
                        <MiniMap />
                        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
                    </ReactFlow>
                </div>
                <WorkflowSidebar />
                <NodeConfigPanel
                    selectedNode={selectedNode}
                    onClose={() => setSelectedNode(null)}
                    onUpdate={updateNodeData}
                />
            </div>
        </div>
    );
};

export default function WorkflowEditor() {
    return (
        <ReactFlowProvider>
            <DashboardLayout>
                <WorkflowEditorContent />
            </DashboardLayout>
        </ReactFlowProvider>
    );
}
