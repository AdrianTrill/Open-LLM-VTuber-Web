import { Box, Stack, Text, Button, Textarea } from '@chakra-ui/react';
import { useState, useEffect } from 'react';

function Mode(): JSX.Element {
  const [currentMode, setCurrentMode] = useState<string>('customer');
  const [scenarios, setScenarios] = useState<{ id: string; name: string; description: string; difficulty: string }[]>([]);
  const [activeScenario, setActiveScenario] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const baseUrl = localStorage.getItem('baseUrl') || '';

  useEffect(() => {
    fetchMode();
    fetchScenarios();
  }, []);

  const fetchMode = async () => {
    try {
      const res = await fetch(`${baseUrl}/api/mode`);
      const data = await res.json();
      setCurrentMode(data.mode || 'customer');
    } catch {
      /* ignore */
    }
  };

  const fetchScenarios = async () => {
    try {
      const res = await fetch(`${baseUrl}/api/scenarios`);
      const data = await res.json();
      setScenarios(data.scenarios || []);
    } catch {
      /* ignore */
    }
  };

  const switchMode = async (mode: string) => {
    setLoading(true);
    try {
      const res = await fetch(`${baseUrl}/api/mode`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode }),
      });
      const data = await res.json();
      setCurrentMode(data.mode || mode);
      setActiveScenario(null);
      setFeedback(mode === 'customer' ? 'Switched to Customer mode' : 'Switched to Training mode');
      setTimeout(() => setFeedback(''), 3000);
    } catch {
      setFeedback('Failed to switch mode');
    }
    setLoading(false);
  };

  const startScenario = async (scenarioId: string) => {
    setLoading(true);
    try {
      const res = await fetch(`${baseUrl}/api/scenarios/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scenario_id: scenarioId }),
      });
      const data = await res.json();
      setActiveScenario(data.scenario || scenarioId);
      setCurrentMode('training');
      setFeedback(`Started scenario: ${data.scenario || scenarioId}`);
      setTimeout(() => setFeedback(''), 4000);
    } catch {
      setFeedback('Failed to start scenario');
    }
    setLoading(false);
  };

  const difficultyColor = (d: string) => {
    if (d === 'beginner') return '#76B900';
    if (d === 'intermediate') return '#f59e0b';
    return '#ef4444';
  };

  return (
    <Stack gap={5} p={4}>
      <Text fontSize="sm" color="rgba(255,255,255,0.5)">
        Switch between customer-facing event mode and associate training mode.
      </Text>

      <Box display="flex" gap={3}>
        <Button
          flex={1}
          bg={currentMode === 'customer' ? '#76B900' : '#1c2030'}
          color="white"
          border="1px solid"
          borderColor={currentMode === 'customer' ? '#76B900' : 'rgba(255,255,255,0.08)'}
          _hover={{ bg: currentMode === 'customer' ? '#6aaa00' : 'rgba(255,255,255,0.06)' }}
          onClick={() => switchMode('customer')}
          disabled={loading}
          size="sm"
        >
          Customer Event
        </Button>
        <Button
          flex={1}
          bg={currentMode === 'training' ? '#76B900' : '#1c2030'}
          color="white"
          border="1px solid"
          borderColor={currentMode === 'training' ? '#76B900' : 'rgba(255,255,255,0.08)'}
          _hover={{ bg: currentMode === 'training' ? '#6aaa00' : 'rgba(255,255,255,0.06)' }}
          onClick={() => switchMode('training')}
          disabled={loading}
          size="sm"
        >
          Training
        </Button>
      </Box>

      {feedback && (
        <Text fontSize="xs" color="#76B900" textAlign="center">
          {feedback}
        </Text>
      )}

      {currentMode === 'training' && (
        <Stack gap={3}>
          <Text fontSize="sm" fontWeight="500" color="rgba(255,255,255,0.8)">
            Training Scenarios
          </Text>
          {scenarios.length === 0 ? (
            <Text fontSize="xs" color="rgba(255,255,255,0.4)">
              No scenarios available. Add YAML files to backend/scenarios/
            </Text>
          ) : (
            scenarios.map((s) => (
              <Box
                key={s.id}
                p={3}
                bg={activeScenario === s.name ? 'rgba(118, 185, 0, 0.1)' : '#1c2030'}
                border="1px solid"
                borderColor={activeScenario === s.name ? 'rgba(118, 185, 0, 0.25)' : 'rgba(255,255,255,0.06)'}
                borderRadius="10px"
                cursor="pointer"
                _hover={{ borderColor: 'rgba(118, 185, 0, 0.3)' }}
                onClick={() => startScenario(s.id)}
                transition="all 0.15s ease"
              >
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                  <Text fontSize="sm" fontWeight="500" color="#f0f0f5">
                    {s.name}
                  </Text>
                  {s.difficulty && (
                    <Text fontSize="10px" color={difficultyColor(s.difficulty)} fontWeight="600" textTransform="uppercase" letterSpacing="0.05em">
                      {s.difficulty}
                    </Text>
                  )}
                </Box>
                <Text fontSize="xs" color="rgba(255,255,255,0.45)" lineHeight="1.4">
                  {s.description}
                </Text>
              </Box>
            ))
          )}
        </Stack>
      )}
    </Stack>
  );
}

export default Mode;
