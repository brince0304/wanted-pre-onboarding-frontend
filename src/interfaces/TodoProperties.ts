export type TodoProperties = TodoPropertiesChild[];
export interface TodoPropertiesChild {
	id: number;
	todo: string;
	isCompleted: boolean;
	userId: number;
}