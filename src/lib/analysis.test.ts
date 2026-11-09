import { test } from 'node:test';
import assert from 'node:assert/strict';
import {analyze,samples,validBuild} from './analysis';
test('sample builds validate and estimate from component sum',()=>{samples.forEach(b=>assert.ok(validBuild(b)));const a=analyze(samples[0]);assert.equal(a.low,17900);assert.equal(a.high,23100);assert.equal(a.verdict,'Within estimate');});
test('no GPU on a CPU without graphics is blocking',()=>{const a=analyze({...samples[0],gpuTier:'None',gpu:'None'});assert.ok(a.blocked);assert.equal(a.scores.Gaming,1);});
test('socket and RAM mismatches are explicit',()=>{const a=analyze({...samples[0],boardSocket:'AM5',boardRam:'DDR5'});assert.ok(a.blocked);assert.ok(a.risks.some(x=>x.includes('RAM generation')));});
test('unknown values are partial, absent dedicated GPU is legitimate zero',()=>{assert.ok(analyze(samples[2]).incomplete);assert.equal(analyze(samples[1]).incomplete,false);});
test('invalid import content and negative prices rejected',()=>{assert.equal(validBuild({}),false);assert.equal(validBuild({...samples[0],asking:-1}),false);assert.equal(validBuild({...samples[0],values:{}}),false);});
