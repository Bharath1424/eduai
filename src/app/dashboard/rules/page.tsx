import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';

export default function RulesPage() {
    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold font-headline">Game Rules</h2>
                <p className="text-muted-foreground">Learn how to play different games.</p>
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle>Carrom</CardTitle>
                    <CardDescription>The complete guide to playing Carrom.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                   <div className="prose max-w-none dark:prose-invert">
                        <h3 className="font-semibold text-lg">Objective</h3>
                        <p>The objective of Carrom is to sink all of your assigned carrom men (either black or white) and the Queen (red piece) before your opponent does.</p>

                        <h3 className="font-semibold text-lg mt-4">Setup</h3>
                        <ol className="list-decimal list-inside space-y-2">
                            <li>The Carrom board is placed on a flat surface.</li>
                            <li>The carrom men are arranged in the center circle of the board. The Queen is placed in the very center.</li>
                            <li>The remaining pieces are arranged around the Queen, alternating between black and white in a specific hexagonal pattern.</li>
                        </ol>

                        <h3 className="font-semibold text-lg mt-4">Gameplay</h3>
                        <ul className="list-disc list-inside space-y-2">
                            <li>Players take turns trying to flick their striker from their baseline to hit and sink their carrom men into any of the four corner pockets.</li>
                            <li>If a player sinks one of their pieces, they get another turn.</li>
                            <li>Sinking the opponent's piece results in a foul, and the opponent's piece is returned to the board by the opponent.</li>
                            <li>The Queen must be "covered" by sinking one of your own pieces immediately after sinking the Queen in the same turn. If you fail to cover the Queen, it is returned to the center.</li>
                            <li>You can only sink the Queen after you have sunk at least one of your own carrom men.</li>
                        </ul>

                        <h3 className="font-semibold text-lg mt-4">Winning</h3>
                        <p>The first player to sink all of their carrom men and the (covered) Queen wins the board.</p>
                   </div>
                </CardContent>
            </Card>
        </div>
    );
}
