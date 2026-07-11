/* eslint-disable */
import { Box, Text, Spinner } from '@chakra-ui/react';
import { useState, useEffect, useCallback } from 'react';
import { TbPlayerPlay, TbCheck } from 'react-icons/tb';

interface Scenario {
  id: string;
  name: string;
  description: string;
  difficulty: string;
}

function difficultyColor(d: string): string {
  if (d === 'beginner') return '#22c55e';
  if (d === 'intermediate') return '#f59e0b';
  return '#ef4444';
}

// Stub — wire to real scoring data when training evaluation API exists
function AccuracyStub() {
  return (
    <Box
      px={3}
      py={2}
      borderRadius="8px"
      bg="rgba(255,255,255,0.03)"
      border="1px solid rgba(255,255,255,0.06)"
    >
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={1.5}>
        <Text fontSize="11px" color="rgba(255,255,255,0.4)" textTransform="uppercase" letterSpacing="0.04em">
          Session accuracy
        </Text>
        <Text fontSize="12px" color="rgba(255,255,255,0.3)" fontWeight="500">
          --%
        </Text>
      </Box>
      <Box
        height="4px"
        borderRadius="2px"
        bg="rgba(255,255,255,0.06)"
        overflow="hidden"
      >
        <Box height="100%" width="0%" borderRadius="2px" bg="rgba(255,255,255,0.2)" transition="width 0.3s ease" />
      </Box>
    </Box>
  );
}

function ScenarioPicker(): JSX.Element {
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [activeScenario, setActiveScenario] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const baseUrl = localStorage.getItem('baseUrl') || '';

  useEffect(() => {
    fetch(`${baseUrl}/api/scenarios`)
      .then((r) => r.json())
      .then((d) => setScenarios(d.scenarios || []))
      .catch(() => {})
      .finally(() => setFetching(false));
  }, [baseUrl]);

  const startScenario = useCallback(async (scenarioId: string) => {
    setLoading(true);
    try {
      const res = await fetch(`${baseUrl}/api/scenarios/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scenario_id: scenarioId }),
      });
      const data = await res.json();
      setActiveScenario(data.scenario || scenarioId);
    } catch {
      /* ignore */
    }
    setLoading(false);
  }, [baseUrl]);

  return (
    <Box px={3} py={3} borderBottom="1px solid" borderColor="rgba(255,255,255,0.04)">
      <Text fontSize="11px" color="rgba(255,255,255,0.35)" textTransform="uppercase" letterSpacing="0.04em" mb={2}>
        Training scenarios
      </Text>

      {fetching ? (
        <Box display="flex" justifyContent="center" py={4}>
          <Spinner size="sm" color="rgba(255,255,255,0.3)" />
        </Box>
      ) : scenarios.length === 0 ? (
        <Text fontSize="12px" color="rgba(255,255,255,0.25)">
          No scenarios available
        </Text>
      ) : (
        <Box display="flex" flexDirection="column" gap={1.5}>
          {scenarios.map((s) => {
            const isActive = activeScenario === s.name || activeScenario === s.id;
            return (
              <Box
                key={s.id}
                px={3}
                py={2}
                borderRadius="8px"
                bg={isActive ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.02)'}
                border="1px solid"
                borderColor={isActive ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.04)'}
                cursor={loading ? 'wait' : 'pointer'}
                _hover={{ borderColor: 'rgba(255,255,255,0.12)', bg: 'rgba(255,255,255,0.04)' }}
                transition="all 0.15s ease"
                onClick={() => !loading && startScenario(s.id)}
              >
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.5}>
                  <Box display="flex" alignItems="center" gap={1.5}>
                    {isActive ? (
                      <TbCheck size={14} color="rgba(255,255,255,0.6)" />
                    ) : (
                      <TbPlayerPlay size={12} color="rgba(255,255,255,0.3)" />
                    )}
                    <Text fontSize="13px" fontWeight="500" color={isActive ? '#f0f0f5' : 'rgba(255,255,255,0.65)'}>
                      {s.name}
                    </Text>
                  </Box>
                  <Text fontSize="10px" color={difficultyColor(s.difficulty)} fontWeight="600" textTransform="uppercase" letterSpacing="0.04em">
                    {s.difficulty}
                  </Text>
                </Box>
                <Text fontSize="11px" color="rgba(255,255,255,0.35)" lineHeight="1.4" pl="22px">
                  {s.description}
                </Text>
              </Box>
            );
          })}
        </Box>
      )}

      {activeScenario && (
        <Box mt={3}>
          <AccuracyStub />
        </Box>
      )}
    </Box>
  );
}

export default ScenarioPicker;
